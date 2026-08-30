'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const FormData = require('form-data');
const { DateTime } = require('luxon');
const mime = require('mime-types');
const syncRequest = require('sync-request');

const EXPORTED_FUNCTIONS = [
  'getRegistrationTelegramBotInfo',
  'configureTelegramBotWebhook',
  'diagnoseTelegramBotSetup',
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
  'processScheduledAnnouncements',
  'sendIkonixWeeklyReport',
  'sendIkonixWeeklyReportNow',
  'installIkonixWeeklyReportTrigger',
  'submitFeedbackForm',
  'registerAdminAccount',
  'loginAdmin',
  'logoutAdmin',
  'getAdminPortalData',
  'setupIkonixOrientationReminderTrigger',
  'sendIkonixOrientationReminders',
  'advanceMemberApplicationWorkflow',
  'batchAdvanceMemberApplicationWorkflow',
  'updateMemberApplicationStatus',
  'updateAdminAccountStatus',
  'diagnoseIkonixPortalSetup',
  'getRegistrationRegions',
  'getRegistrationProvinces',
  'getRegistrationCities',
  'getFacebookLinkGuideSlides',
  'handleTelegramWebhookUpdate_'
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

class RuntimeState {
  constructor(filePath) {
    this.filePath = path.resolve(filePath);
    this.value = { properties: {}, files: {} };
    this.load();
  }

  load() {
    if (!fs.existsSync(this.filePath)) return;
    const parsed = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    this.value.properties = parsed.properties || {};
    this.value.files = parsed.files || {};
  }

  save() {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, `${JSON.stringify(this.value, null, 2)}\n`, 'utf8');
  }

  snapshot() {
    return clone(this.value);
  }

  restore(snapshot) {
    this.value = clone(snapshot);
    this.save();
  }
}

class AppsScriptBlob {
  constructor(bytes, contentType, name) {
    this.buffer = Buffer.isBuffer(bytes) ? Buffer.from(bytes) : Buffer.from(bytes || []);
    this.contentType = String(contentType || 'application/octet-stream');
    this.name = String(name || 'file');
  }

  getBytes() {
    return Array.from(this.buffer);
  }

  getContentType() {
    return this.contentType;
  }

  getName() {
    return this.name;
  }
}

function sanitizeFileName(value) {
  const cleaned = String(value || 'file').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').slice(0, 220);
  return cleaned || 'file';
}

class AppsScriptFile {
  constructor(fileStore, id, record) {
    this.fileStore = fileStore;
    this.id = id;
    this.record = record || null;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.record ? this.record.name : this.id;
  }

  getUrl() {
    return this.fileStore.publicUrl(this.id) || `https://drive.google.com/file/d/${encodeURIComponent(this.id)}/view`;
  }

  getBlob() {
    if (this.record) {
      const filePath = path.resolve(this.record.path);
      if (!filePath.startsWith(this.fileStore.uploadDirectory + path.sep) && filePath !== this.fileStore.uploadDirectory) {
        throw new Error('Stored file path is outside the upload directory.');
      }
      return new AppsScriptBlob(fs.readFileSync(filePath), this.record.mimeType, this.record.name);
    }
    const url = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(this.id)}`;
    const response = syncRequest('GET', url, { followRedirects: true, timeout: 30000 });
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error('Unable to download the selected Google Drive file.');
    }
    return new AppsScriptBlob(response.getBody(), response.headers['content-type'] || mime.lookup(this.id), this.id);
  }

  setSharing() {
    return this;
  }

  setTrashed(trashed) {
    if (!trashed || !this.record) return this;
    const filePath = path.resolve(this.record.path);
    if (filePath.startsWith(this.fileStore.uploadDirectory + path.sep) && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    delete this.fileStore.state.value.files[this.id];
    this.fileStore.state.save();
    return this;
  }
}

class AppsScriptFolder {
  constructor(fileStore) {
    this.fileStore = fileStore;
  }

  createFile(blob) {
    return this.fileStore.createFile(blob);
  }
}

class AppsScriptFileStore {
  constructor(options) {
    this.state = options.state;
    this.uploadDirectory = path.resolve(options.uploadDirectory);
    this.publicBaseUrl = String(options.publicBaseUrl || '').replace(/\/$/, '');
    fs.mkdirSync(this.uploadDirectory, { recursive: true });
  }

  createFile(blob) {
    const id = `local_${crypto.randomUUID().replace(/-/g, '')}`;
    const name = `${id}_${sanitizeFileName(blob.getName())}`;
    const filePath = path.join(this.uploadDirectory, name);
    fs.writeFileSync(filePath, blob.buffer);
    const record = {
      name: blob.getName(),
      storedName: name,
      path: filePath,
      mimeType: blob.getContentType(),
      size: blob.buffer.length,
      createdAt: new Date().toISOString()
    };
    this.state.value.files[id] = record;
    this.state.save();
    return new AppsScriptFile(this, id, record);
  }

  getFile(id) {
    const key = String(id || '');
    return new AppsScriptFile(this, key, this.state.value.files[key] || null);
  }

  publicUrl(id) {
    const record = this.state.value.files[String(id || '')];
    if (!record) return '';
    const relative = `/uploads/${encodeURIComponent(record.storedName)}`;
    return this.publicBaseUrl ? this.publicBaseUrl + relative : relative;
  }
}

class UrlFetchResponse {
  constructor(response) {
    this.response = response;
  }

  getResponseCode() {
    return Number(this.response.statusCode);
  }

  getContentText() {
    return this.response.getBody('utf8');
  }

  getBlob() {
    return new AppsScriptBlob(this.response.getBody(), this.response.headers['content-type'] || 'application/octet-stream', 'response');
  }
}

function createUrlFetchApp() {
  return {
    fetch(url, options) {
      const source = options || {};
      const method = String(source.method || 'get').toUpperCase();
      const requestOptions = {
        headers: Object.assign({}, source.headers || {}),
        followRedirects: source.followRedirects !== false,
        timeout: Number(source.timeout || 30000)
      };
      const payload = source.payload;
      if (payload !== undefined && payload !== null) {
        const hasBlob = payload && typeof payload === 'object' && Object.values(payload).some((value) => value instanceof AppsScriptBlob);
        if (hasBlob) {
          const form = new FormData();
          Object.entries(payload).forEach(([key, value]) => {
            if (value instanceof AppsScriptBlob) {
              form.append(key, value.buffer, { filename: value.getName(), contentType: value.getContentType() });
            } else {
              form.append(key, typeof value === 'string' ? value : JSON.stringify(value));
            }
          });
          requestOptions.headers = Object.assign(requestOptions.headers, form.getHeaders());
          requestOptions.body = form.getBuffer();
        } else if (typeof payload === 'object' && !Buffer.isBuffer(payload)) {
          requestOptions.form = payload;
        } else {
          requestOptions.body = payload;
        }
      }
      if (source.contentType) requestOptions.headers['Content-Type'] = source.contentType;
      let response;
      try {
        response = syncRequest(method, String(url), requestOptions);
      } catch (error) {
        throw new Error(`Network request failed: ${error.message}`);
      }
      if (!source.muteHttpExceptions && (response.statusCode < 200 || response.statusCode >= 300)) {
        throw new Error(`Request failed with HTTP ${response.statusCode}.`);
      }
      return new UrlFetchResponse(response);
    }
  };
}

function createCacheService(cache) {
  const scriptCache = {
    get(key) {
      const item = cache.get(String(key));
      if (!item) return null;
      if (item.expiresAt <= Date.now()) {
        cache.delete(String(key));
        return null;
      }
      return item.value;
    },
    put(key, value, ttlSeconds) {
      cache.set(String(key), { value: String(value), expiresAt: Date.now() + (Math.max(1, Number(ttlSeconds || 1)) * 1000) });
    },
    remove(key) {
      cache.delete(String(key));
    }
  };
  return { getScriptCache: () => scriptCache };
}

function createPropertiesService(state) {
  const properties = {
    getProperty(key) {
      const name = String(key);
      if (Object.prototype.hasOwnProperty.call(process.env, name) && process.env[name] !== '') return process.env[name];
      return Object.prototype.hasOwnProperty.call(state.value.properties, name) ? state.value.properties[name] : null;
    },
    setProperty(key, value) {
      state.value.properties[String(key)] = String(value);
      state.save();
      return properties;
    },
    deleteProperty(key) {
      delete state.value.properties[String(key)];
      state.save();
      return properties;
    }
  };
  return { getScriptProperties: () => properties };
}

function createUtilities(timeZone) {
  return {
    DigestAlgorithm: { SHA_256: 'sha256' },
    Charset: { UTF_8: 'utf8' },
    computeDigest(algorithm, value) {
      const input = Buffer.isBuffer(value) ? value : Buffer.from(String(value == null ? '' : value), 'utf8');
      return Array.from(crypto.createHash(algorithm === 'sha256' ? 'sha256' : 'sha256').update(input).digest());
    },
    base64Encode(bytes) {
      return Buffer.from(bytes || []).toString('base64');
    },
    base64EncodeWebSafe(bytes) {
      return Buffer.from(bytes || []).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    },
    base64Decode(value) {
      return Array.from(Buffer.from(String(value || '').replace(/-/g, '+').replace(/_/g, '/'), 'base64'));
    },
    formatDate(value, zone, pattern) {
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) throw new Error('Invalid date.');
      return DateTime.fromJSDate(date).setZone(zone || timeZone).toFormat(pattern);
    },
    parseDate(value, zone, pattern) {
      const parsed = DateTime.fromFormat(String(value || ''), pattern, { zone: zone || timeZone });
      if (!parsed.isValid) throw new Error('Invalid date.');
      return parsed.toJSDate();
    },
    getUuid() {
      return crypto.randomUUID();
    },
    newBlob(bytes, contentType, name) {
      return new AppsScriptBlob(bytes, contentType, name);
    }
  };
}

function createScriptApp(publicBaseUrl) {
  const handlers = new Set();
  class Trigger {
    constructor(handler) { this.handler = handler; }
    getHandlerFunction() { return this.handler; }
  }
  class TriggerBuilder {
    constructor(handler) { this.handler = handler; }
    timeBased() { return this; }
    everyMinutes() { return this; }
    everyHours() { return this; }
    everyDays() { return this; }
    onWeekDay() { return this; }
    atHour() { return this; }
    create() { handlers.add(this.handler); return new Trigger(this.handler); }
  }
  return {
    WeekDay: { SUNDAY: 'SUNDAY', MONDAY: 'MONDAY', TUESDAY: 'TUESDAY', WEDNESDAY: 'WEDNESDAY', THURSDAY: 'THURSDAY', FRIDAY: 'FRIDAY', SATURDAY: 'SATURDAY' },
    getProjectTriggers: () => Array.from(handlers).map((handler) => new Trigger(handler)),
    newTrigger: (handler) => new TriggerBuilder(handler),
    deleteTrigger: (trigger) => handlers.delete(trigger.getHandlerFunction()),
    getService: () => ({ getUrl: () => `${String(publicBaseUrl || '').replace(/\/$/, '')}/api/telegram/webhook` })
  };
}

function createSlidesService() {
  let configured = [];
  try { configured = JSON.parse(process.env.FACEBOOK_GUIDE_SLIDES_JSON || '[]'); } catch (error) { configured = []; }
  return {
    Presentations: {
      get: () => ({ title: 'How to get your Facebook link', slides: configured.map((slide, index) => ({ objectId: String(slide.objectId || index + 1) })) }),
      Pages: {
        getThumbnail: (presentationId, objectId) => {
          const match = configured.find((slide, index) => String(slide.objectId || index + 1) === String(objectId)) || {};
          return { contentUrl: String(match.imageUrl || ''), width: match.width || '', height: match.height || '' };
        }
      }
    }
  };
}

function createAppsScriptRuntime(options) {
  const workbook = options.workbook;
  const timeZone = options.timeZone || 'Asia/Manila';
  const publicBaseUrl = options.publicBaseUrl || '';
  const state = new RuntimeState(options.stateFile);
  const fileStore = new AppsScriptFileStore({ state, uploadDirectory: options.uploadDirectory, publicBaseUrl });
  const cache = new Map();
  let emailQueue = [];

  const DriveApp = {
    Access: { ANYONE_WITH_LINK: 'ANYONE_WITH_LINK' },
    Permission: { VIEW: 'VIEW' },
    getFolderById: () => new AppsScriptFolder(fileStore),
    getFileById: (id) => fileStore.getFile(id),
    getPublicUrl: (id) => fileStore.publicUrl(id)
  };
  const MailApp = {
    sendEmail(messageOrTo, subject, body) {
      const message = typeof messageOrTo === 'object'
        ? Object.assign({}, messageOrTo)
        : { to: messageOrTo, subject, body };
      emailQueue.push(message);
    }
  };
  const LockService = {
    getScriptLock: () => ({ waitLock: () => true, tryLock: () => true, releaseLock: () => undefined })
  };
  const HtmlService = {
    XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' },
    createHtmlOutput: (value) => value,
    createHtmlOutputFromFile: () => ({ setTitle() { return this; }, setXFrameOptionsMode() { return this; } })
  };
  const SpreadsheetApp = {
    openById: () => workbook.spreadsheet(),
    flush: () => undefined
  };

  const context = vm.createContext({
    console,
    CacheService: createCacheService(cache),
    DriveApp,
    HtmlService,
    LockService,
    MailApp,
    PropertiesService: createPropertiesService(state),
    ScriptApp: createScriptApp(publicBaseUrl),
    Session: { getScriptTimeZone: () => timeZone },
    Slides: createSlidesService(),
    SpreadsheetApp,
    UrlFetchApp: createUrlFetchApp(),
    Utilities: createUtilities(timeZone)
  });

  const source = fs.readFileSync(options.codeFile, 'utf8');
  const exportExpression = EXPORTED_FUNCTIONS.map((name) => `${JSON.stringify(name)}: typeof ${name} === 'function' ? ${name} : undefined`).join(',\n');
  vm.runInContext(`${source}\nthis.__gasExports = {\n${exportExpression}\n};`, context, { filename: options.codeFile });

  return {
    methods: Object.keys(context.__gasExports).filter((name) => typeof context.__gasExports[name] === 'function'),
    invoke(method, args) {
      const fn = context.__gasExports[String(method)];
      if (typeof fn !== 'function') throw new Error(`Unknown IKONIX method: ${method}`);
      return fn.apply(null, Array.isArray(args) ? args : []);
    },
    drainEmails() {
      const pending = emailQueue;
      emailQueue = [];
      return pending;
    },
    snapshotState() {
      return { state: state.snapshot(), cache: clone(Array.from(cache.entries())), emails: clone(emailQueue) };
    },
    restoreState(snapshot) {
      state.restore(snapshot.state);
      cache.clear();
      (snapshot.cache || []).forEach(([key, value]) => cache.set(key, value));
      emailQueue = clone(snapshot.emails || []);
    }
  };
}

module.exports = { EXPORTED_FUNCTIONS, createAppsScriptRuntime };
