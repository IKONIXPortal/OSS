'use strict';

require('dotenv').config();

const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const cron = require('node-cron');
const { JsonWorkbook } = require('./server/json-workbook');
const { createAppsScriptRuntime } = require('./server/apps-script-runtime');
const { GitHubJsonSync } = require('./server/github-sync');
const { createMailer } = require('./server/mailer');

const PUBLIC_RPC_METHODS = new Set([
  'getRegistrationTelegramBotInfo',
  'sendRegistrationOtp',
  'verifyRegistrationOtp',
  'sendRegistrationTelegramOtp',
  'verifyRegistrationTelegramOtp',
  'checkRegistrationMemberAvailability',
  'submitRegistrationForm',
  'uploadPortalLibraryFile',
  'getPortalLibraryAudioData',
  'archivePortalLibraryFile',
  'refreshTelegramAnnouncementGroups',
  'createScheduledAnnouncement',
  'sendIkonixWeeklyReportNow',
  'submitFeedbackForm',
  'registerAdminAccount',
  'loginAdmin',
  'logoutAdmin',
  'getAdminPortalData',
  'advanceMemberApplicationWorkflow',
  'batchAdvanceMemberApplicationWorkflow',
  'updateAdminAccountStatus',
  'getRegistrationRegions',
  'getRegistrationProvinces',
  'getRegistrationCities',
  'getFacebookLinkGuideSlides'
]);

function enabled(value, defaultValue) {
  if (value === undefined || value === '') return defaultValue;
  return String(value).toLowerCase() === 'true';
}

async function createApplication(environment) {
  const env = environment || process.env;
  const projectRoot = __dirname;
  const port = Number(env.PORT || 3000);
  const publicBaseUrl = String(env.PUBLIC_BASE_URL || `http://localhost:${port}`).replace(/\/$/, '');
  const workbook = new JsonWorkbook(projectRoot);
  const githubSync = new GitHubJsonSync({
    enabled: enabled(env.GITHUB_SYNC_ENABLED, false),
    writeEnabled: enabled(env.GITHUB_WRITE_ENABLED, false),
    requirePrivate: enabled(env.REQUIRE_PRIVATE_DATA_REPO, true),
    repository: env.GITHUB_DATA_REPO,
    branch: env.GITHUB_DATA_BRANCH,
    token: env.GITHUB_TOKEN
  });
  await githubSync.verifySafety();
  await githubSync.pullInto(workbook);

  const runtime = createAppsScriptRuntime({
    workbook,
    codeFile: path.join(projectRoot, 'server', 'apps-script', 'Code.gs'),
    stateFile: path.resolve(projectRoot, env.RUNTIME_STATE_FILE || '.runtime/state.json'),
    uploadDirectory: path.resolve(projectRoot, env.UPLOAD_DIR || 'public/uploads'),
    publicBaseUrl,
    timeZone: env.TIME_ZONE || 'Asia/Manila'
  });
  const mailer = createMailer(env);
  if (enabled(env.VERIFY_SMTP_ON_START, false)) await mailer.verify();

  let operationQueue = Promise.resolve();
  function serialized(task) {
    const operation = operationQueue.then(task, task);
    operationQueue = operation.catch(() => undefined);
    return operation;
  }

  async function execute(method, args) {
    return serialized(async () => {
      const workbookSnapshot = workbook.snapshot();
      const runtimeSnapshot = runtime.snapshotState();
      let result;
      let dirtyNames;
      try {
        result = runtime.invoke(method, args || []);
        dirtyNames = workbook.flushDirty();
        await githubSync.push(workbook, dirtyNames);
      } catch (error) {
        workbook.restore(workbookSnapshot, true);
        runtime.restoreState(runtimeSnapshot);
        runtime.drainEmails();
        throw error;
      }

      const emails = runtime.drainEmails();
      await mailer.sendAll(emails);
      return result;
    });
  }

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
  app.use(express.json({ limit: '25mb' }));

  const rpcLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { ok: false, error: 'Too many requests. Please wait a moment and try again.' }
  });
  const webhookLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many requests'
  });

  app.get('/api/health', (request, response) => {
    response.json({ ok: true, service: 'ikonix-portal', methods: runtime.methods.length });
  });

  app.post('/api/rpc', rpcLimiter, async (request, response) => {
    const method = String(request.body && request.body.method || '');
    const args = request.body && Array.isArray(request.body.args) ? request.body.args : [];
    if (!PUBLIC_RPC_METHODS.has(method)) {
      response.status(404).json({ ok: false, error: 'Unknown IKONIX request.' });
      return;
    }
    try {
      const result = await execute(method, args);
      response.json({ ok: true, result: result === undefined ? null : result });
    } catch (error) {
      console.error(`[RPC ${method}]`, error);
      response.status(400).json({ ok: false, error: error && error.message ? error.message : 'The IKONIX request failed.' });
    }
  });

  app.post('/api/telegram/webhook', webhookLimiter, async (request, response) => {
    const expectedKey = String(env.TELEGRAM_WEBHOOK_KEY || '');
    const receivedKey = String(request.query.telegramWebhookKey || '');
    if (!expectedKey || receivedKey !== expectedKey) {
      response.status(403).send('Forbidden');
      return;
    }
    try {
      await execute('handleTelegramWebhookUpdate_', [request.body || {}]);
      response.send('OK');
    } catch (error) {
      console.error('[Telegram webhook]', error);
      response.status(500).send('Error');
    }
  });

  app.use(express.static(path.join(projectRoot, 'public'), { index: 'index.html', fallthrough: true }));
  app.get('/', (request, response) => response.sendFile(path.join(projectRoot, 'public', 'index.html')));

  function scheduleJobs() {
    const timeZone = env.TIME_ZONE || 'Asia/Manila';
    const jobs = [
      cron.schedule('* * * * *', () => execute('processScheduledAnnouncements', []).catch((error) => console.error('[Announcements job]', error)), { timezone: timeZone }),
      cron.schedule('0 * * * *', () => execute('sendIkonixOrientationReminders', []).catch((error) => console.error('[Orientation job]', error)), { timezone: timeZone }),
      cron.schedule('0 22 * * 0', () => execute('sendIkonixWeeklyReport', []).catch((error) => console.error('[Weekly report job]', error)), { timezone: timeZone })
    ];
    return () => jobs.forEach((job) => job.stop());
  }

  return { app, execute, workbook, runtime, scheduleJobs, port };
}

async function main() {
  const application = await createApplication(process.env);
  if (enabled(process.env.ENABLE_JOBS, process.env.NODE_ENV === 'production')) application.scheduleJobs();
  application.app.listen(application.port, () => {
    console.log(`IKONIX Portal listening on http://localhost:${application.port}`);
  });
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { PUBLIC_RPC_METHODS, createApplication };
