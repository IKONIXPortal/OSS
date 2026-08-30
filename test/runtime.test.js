'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { DEFAULT_HEADERS, JsonWorkbook } = require('../server/json-workbook');
const { createAppsScriptRuntime } = require('../server/apps-script-runtime');

const projectRoot = path.resolve(__dirname, '..');

function makeFixture() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ikonix-portal-'));
  Object.keys(DEFAULT_HEADERS).forEach((name) => {
    fs.copyFileSync(path.join(projectRoot, `${name}.json`), path.join(directory, `${name}.json`));
  });
  return directory;
}

test('frontend bridge and migrated Apps Script source compile', () => {
  new vm.Script(fs.readFileSync(path.join(projectRoot, 'public', 'gas-bridge.js'), 'utf8'));
  const html = fs.readFileSync(path.join(projectRoot, 'public', 'index.html'), 'utf8');
  assert.match(html, /gas-bridge\.js/);
  assert.match(html, /IKONIX Registration/);
});

test('JSON workbook preserves one file per sheet', () => {
  const fixture = makeFixture();
  try {
    const workbook = new JsonWorkbook(fixture);
    Object.keys(DEFAULT_HEADERS).forEach((name) => assert.ok(workbook.getSheet(name), `${name} sheet was not loaded`));
    const registration = workbook.getSheet('Registration');
    assert.deepEqual(registration.getRange(1, 1, 1, 18).getDisplayValues()[0], DEFAULT_HEADERS.Registration);
    assert.equal(registration.getLastRow(), 47);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('Apps Script compatibility runtime writes feedback to Feedback.json', () => {
  const fixture = makeFixture();
  try {
    const workbook = new JsonWorkbook(fixture);
    const before = workbook.sheetToRecords('Feedback').length;
    const runtime = createAppsScriptRuntime({
      workbook,
      codeFile: path.join(projectRoot, 'server', 'apps-script', 'Code.gs'),
      stateFile: path.join(fixture, '.runtime', 'state.json'),
      uploadDirectory: path.join(fixture, 'uploads'),
      publicBaseUrl: 'http://localhost:3000',
      timeZone: 'Asia/Manila'
    });
    const result = runtime.invoke('submitFeedbackForm', [{
      name: 'Migration smoke test',
      feedback: 'The compatibility runtime is working.',
      suggestion: 'Keep this automated test.'
    }]);
    assert.equal(result.ok, true);
    assert.ok(workbook.dirtyNames().includes('Feedback'));
    workbook.flushDirty();
    const persisted = JSON.parse(fs.readFileSync(path.join(fixture, 'Feedback.json'), 'utf8'));
    assert.equal(persisted.length, before + 1);
    assert.equal(persisted.at(-1).Name, 'Migration smoke test');
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('email OTP registration keeps the original Registration and Workflow flow', () => {
  const fixture = makeFixture();
  try {
    const workbook = new JsonWorkbook(fixture);
    const registrationCount = workbook.sheetToRecords('Registration').length;
    const workflowCount = workbook.sheetToRecords('Workflow').length;
    const runtime = createAppsScriptRuntime({
      workbook,
      codeFile: path.join(projectRoot, 'server', 'apps-script', 'Code.gs'),
      stateFile: path.join(fixture, '.runtime', 'state.json'),
      uploadDirectory: path.join(fixture, 'uploads'),
      publicBaseUrl: 'http://localhost:3000',
      timeZone: 'Asia/Manila'
    });
    const suffix = String(Date.now()).slice(-8);
    const email = `migration-${suffix}@example.com`;
    const telegram = `@migration_${suffix}`;
    const heesayId = `MIG${suffix}`;

    const sent = runtime.invoke('sendRegistrationOtp', [email]);
    assert.equal(sent.ok, true);
    const messages = runtime.drainEmails();
    assert.equal(messages.length, 1);
    const otpMatch = String(messages[0].body || '').match(/\b(\d{6})\b/);
    assert.ok(otpMatch, 'OTP was not present in the queued email');
    assert.equal(runtime.invoke('verifyRegistrationOtp', [email, otpMatch[1]]).ok, true);

    const result = runtime.invoke('submitRegistrationForm', [{
      otpMethod: 'email',
      emailAddress: email,
      firstName: 'Migration',
      middleInitial: 'T',
      lastName: 'Smoke',
      tgUsername: telegram,
      heesayName: 'Migration Smoke',
      heesayId,
      locationType: 'Local',
      region: 'National Capital Region (NCR)',
      province: 'Metro Manila',
      city: 'City of Manila',
      overseasLocation: '',
      mobile: '09123456789',
      heesayProfileLink: `https://international.walla-app.com/user?id=${heesayId}&app=2`,
      photo: null
    }]);
    assert.equal(result.ok, true);
    assert.equal(result.status, 'Pending');
    workbook.flushDirty();
    assert.equal(JSON.parse(fs.readFileSync(path.join(fixture, 'Registration.json'), 'utf8')).length, registrationCount + 1);
    assert.equal(JSON.parse(fs.readFileSync(path.join(fixture, 'Workflow.json'), 'utf8')).length, workflowCount + 1);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
