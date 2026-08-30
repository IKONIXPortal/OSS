// ================================
// IKONIX MEMBER REGISTRATION
// Standalone Apps Script server for Form A registration.
// ================================

const FORM_ID = '1s-knXrN89EQDy65AY8iCZRcUsi8riD2N-Y6sWWNfV1c';
const SETTINGS_ID = '1kQfNFHz18nsHq0P9oNxqc8QdQcVRPbYjLc3x5JUO5gA';
const SETTINGS_SHEET = 'Credentials';
const FORM_A = 'Registration';
const FORM_B = 'Form B';
const FORM_C_EXIT = 'Form C : Exit Form';

const FORM_B_STATUS_COL = 10;
const FORM_B_REASON_COL = 11;
const FORM_B_MATCH_COL = 12;
const FORM_A_UNICODE_COL = 1;
const FORM_A_TIMESTAMP_COL = 2;
const FORM_A_EMAIL_COL = 3;
const FORM_A_FIRST_NAME_COL = 4;
const FORM_A_MIDDLE_INITIAL_COL = 5;
const FORM_A_LAST_NAME_COL = 6;
const FORM_A_FB_NAME_COL = 7;
const FORM_A_CODE_NAME_COL = 8;
const FORM_A_LOCATION_COL = 9;
const FORM_A_MOBILE_COL = 10;
const FORM_A_BIRTHDATE_COL = 12;
const FORM_A_FB_LINK_COL = 13;
const FORM_A_SOURCE_COL = 14;
const FORM_A_SOURCE_DETAIL_COL = 15;
const FORM_A_AGE_COL = 16;
const FORM_A_STATUS_COL = 18;

// IKONIX Registration output schema (Sheet1)
const IKONIX_TIMESTAMP_COL = 1;
const IKONIX_EMAIL_COL = 2;
const IKONIX_FIRST_NAME_COL = 3;
const IKONIX_MIDDLE_INITIAL_COL = 4;
const IKONIX_LAST_NAME_COL = 5;
const IKONIX_TG_USERNAME_COL = 6;
const IKONIX_HEESAY_NAME_COL = 7;
const IKONIX_HEESAY_ID_COL = 8;
const IKONIX_LOCATION_TYPE_COL = 9;
const IKONIX_REGION_COL = 10;
const IKONIX_PROVINCE_COL = 11;
const IKONIX_CITY_COL = 12;
const IKONIX_OVERSEAS_LOCATION_COL = 13;
const IKONIX_MOBILE_COL = 14;
const IKONIX_HEESAY_PROFILE_COL = 15;
const IKONIX_PHOTO_URL_COL = 16;
const IKONIX_APPROVED_BY_TG_COL = 17;
const IKONIX_STATUS_COL = 18;
const IKONIX_PHOTO_FOLDER_ID = '18STKUN1YK9-U3U0zPj-5_NkEuNOoZ1G1';
const IKONIX_MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const LOGIN_SHEET = 'Login';
const FEEDBACK_SHEET = 'Feedback';
const FEEDBACK_HEADERS = ['Submitted At', 'Name', 'Feedback', 'Suggestion'];
const LOGIN_HEADERS = ['Registered At', 'TG Account', 'Password Salt', 'Password Hash', 'Status', 'Approved By', 'Approved At', 'Last Login', 'Role'];
const LOGIN_ROLE_COL = 9;
const LOGIN_STATUS_COL = 5;
const PORTAL_OWNER_TG_ACCOUNT = '@patrick_starfishes';
const TELEGRAM_GROUPS_SHEET = 'Telegram Groups';
const TELEGRAM_GROUPS_HEADERS = ['Chat ID', 'Group Chat', 'Type', 'Username', 'First Seen At', 'Last Seen At', 'Status'];
const ANNOUNCEMENTS_SHEET = 'Announcements';
const ANNOUNCEMENT_HEADERS = ['Announcement ID', 'Created At', 'Created By TG', 'Title', 'Body', 'Photo File ID', 'Photo Name', 'Scheduled Date', 'Scheduled Time', 'Time Zone', 'Chat ID', 'Group Chat', 'Status', 'Posted At', 'Telegram Message IDs', 'Error'];
const ANNOUNCEMENT_TRIGGER_FUNCTION = 'processScheduledAnnouncements';
const ANNOUNCEMENT_MAX_TITLE_LENGTH = 120;
const ANNOUNCEMENT_MAX_BODY_LENGTH = 3500;
const ANNOUNCEMENT_MAX_DATE_COUNT = 31;
const ANNOUNCEMENT_MAX_GROUP_COUNT = 50;
const ANNOUNCEMENT_MAX_DISPATCH_COUNT = 500;
const TELEGRAM_REQUIRED_ALLOWED_UPDATES = ['message', 'edited_message', 'my_chat_member'];
const WEEKLY_REPORT_CHAT_ID = '-1004359642404';
const WEEKLY_REPORT_TRIGGER_FUNCTION = 'sendIkonixWeeklyReport';
const PORTAL_LIBRARY_SHEET = 'Library';
const PORTAL_LIBRARY_FOLDER_ID = '1Ndt04KLl8Wl9j4R3PC0jqOa9a4rvIXse';
const PORTAL_LIBRARY_MAX_BYTES = 20 * 1024 * 1024;
const PORTAL_LIBRARY_HEADERS = [
  'Library ID',
  'File Name',
  'MIME Type',
  'Drive File ID',
  'Drive URL',
  'Preview URL',
  'Direct URL',
  'Size Bytes',
  'Status',
  'Uploaded At',
  'Updated At',
  'Uploaded By TG Username',
  'Archived At',
  'Archived By TG Username'
];
const ADMIN_SESSION_TTL_SECONDS = 6 * 60 * 60;
const ADMIN_PERSISTENT_SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const ADMIN_PERSISTENT_SESSION_PROPERTY_PREFIX = 'ikonix_admin_persistent_session_';
const ADMIN_SESSION_CACHE_PREFIX = 'ikonix_admin_session_';
const ADMIN_LOGIN_RATE_PREFIX = 'ikonix_admin_login_attempt_';
const ADMIN_LOGIN_MAX_ATTEMPTS = 5;
const ADMIN_LOGIN_RATE_SECONDS = 10 * 60;
const IKONIX_NOTIFICATION_CHAT_PREFIX = 'ikonix_notification_chat_';
const IKONIX_WORKFLOW_SHEET = 'Workflow';
const IKONIX_WORKFLOW_HEADERS = [
  'Application Row',
  'Stage',
  'Assessment Started At',
  'Orientation Schedule',
  'Orientation Completed At',
  'Decision By TG Username',
  'Decision At',
  'Notification Summary',
  'Invitation Status',
  'Invitation At',
  'Updated By TG Username',
  'Updated At',
  'Orientation Method',
  'Orientation VCR Link',
  'Reminder Sent At',
  'Exit Effective Date',
  'Exit By TG Username',
  'Exit Recorded At'
];

const REGISTRATION_OTP_TTL_SECONDS = 10 * 60;
const REGISTRATION_VERIFIED_TTL_SECONDS = 6 * 60 * 60;
const REGISTRATION_OTP_RESEND_SECONDS = 60;
// Telegram bot settings are stored in Apps Script > Project Settings > Script Properties.
const TELEGRAM_BOT_TOKEN_PROPERTY = 'TELEGRAM_BOT_TOKEN';
const TELEGRAM_WEB_APP_URL_PROPERTY = 'TELEGRAM_WEB_APP_URL';
const TELEGRAM_WEBHOOK_KEY_PROPERTY = 'TELEGRAM_WEBHOOK_KEY';
// Preserve the working mapping prefix so existing bot connections remain compatible.
const TELEGRAM_CHAT_PROPERTY_PREFIX = 'htrk_telegram_chat_';
const TELEGRAM_BOT_CACHE_KEY = 'ikonix_telegram_bot_identity';
const TELEGRAM_CHAT_LINK_TTL_MS = 30 * 60 * 1000;
const PSGC_API_BASE_URL = 'https://psgc.cloud/api';
const PSGC_LOCATION_CACHE_SECONDS = 12 * 60 * 60;
const PSGC_NCR_REGION_CODE = '1300000000';
const PSGC_NCR_PROVINCE_CODE = '__NCR__';
const PSGC_NCR_PROVINCE_NAME = 'Metro Manila';
const FACEBOOK_LINK_GUIDE_PRESENTATION_ID = '1JQY81PA9PVyyALMnKEoA15DLNV_MWrFSkLS5pefOTUY';
const FACEBOOK_LINK_GUIDE_PRESENTATION_URL = 'https://docs.google.com/presentation/d/1JQY81PA9PVyyALMnKEoA15DLNV_MWrFSkLS5pefOTUY/edit?usp=drive_link';

const UNICODE_REGEX = /^[A-Za-z][0-9]{2}[A-Za-z]{2}[0-9]{3}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM_USERNAME_REGEX = /^@[A-Za-z][A-Za-z0-9_]{4,31}$/;
const URL_REGEX = /^https?:\/\/.+/i;
const PHONE_REGEX = /^\d+$/;

const PSGC_REGION_CODES_BY_NAME = {
  'region i': '0100000000',
  'region i ilocos region': '0100000000',
  'region i (ilocos region)': '0100000000',
  'region ii': '0200000000',
  'region ii cagayan valley': '0200000000',
  'region ii (cagayan valley)': '0200000000',
  'region iii': '0300000000',
  'region iii central luzon': '0300000000',
  'region iii (central luzon)': '0300000000',
  'region iv-a': '0400000000',
  'region iv-a calabarzon': '0400000000',
  'region iv-a (calabarzon)': '0400000000',
  'region iv-b': '1700000000',
  'mimaropa': '1700000000',
  'mimaropa region': '1700000000',
  'region v': '0500000000',
  'region v bicol region': '0500000000',
  'region v (bicol region)': '0500000000',
  'region vi': '0600000000',
  'region vi western visayas': '0600000000',
  'region vi (western visayas)': '0600000000',
  'region vii': '0700000000',
  'region vii central visayas': '0700000000',
  'region vii (central visayas)': '0700000000',
  'region viii': '0800000000',
  'region viii eastern visayas': '0800000000',
  'region viii (eastern visayas)': '0800000000',
  'region ix': '0900000000',
  'region ix zamboanga peninsula': '0900000000',
  'region ix (zamboanga peninsula)': '0900000000',
  'region x': '1000000000',
  'region x northern mindanao': '1000000000',
  'region x (northern mindanao)': '1000000000',
  'region xi': '1100000000',
  'region xi davao region': '1100000000',
  'region xi (davao region)': '1100000000',
  'region xii': '1200000000',
  'region xii soccsksargen': '1200000000',
  'region xii (soccsksargen)': '1200000000',
  'ncr': PSGC_NCR_REGION_CODE,
  'national capital region': PSGC_NCR_REGION_CODE,
  'national capital region ncr': PSGC_NCR_REGION_CODE,
  'national capital region (ncr)': PSGC_NCR_REGION_CODE,
  'metro manila': PSGC_NCR_REGION_CODE,
  'car': '1400000000',
  'cordillera administrative region': '1400000000',
  'cordillera administrative region car': '1400000000',
  'cordillera administrative region (car)': '1400000000',
  'barmm': '1900000000',
  'bangsamoro autonomous region in muslim mindanao': '1900000000',
  'caraga': '1600000000'
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('IKONIX Registration')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const expectedKey = scriptProperties.getProperty(TELEGRAM_WEBHOOK_KEY_PROPERTY);
  const receivedKey = e && e.parameter ? String(e.parameter.telegramWebhookKey || '') : '';

  if (!expectedKey || receivedKey !== expectedKey) {
    return HtmlService.createHtmlOutput('Forbidden');
  }

  try {
    const update = JSON.parse((e.postData && e.postData.contents) || '{}');
    handleTelegramWebhookUpdate_(update);
  } catch (err) {
    console.error('Telegram webhook error: ' + String(err && err.message ? err.message : err));
  }

  return HtmlService.createHtmlOutput('OK');
}

function openSpreadsheet_(id) {
  try {
    return SpreadsheetApp.openById(id);
  } catch (err) {
    throw new Error('Unable to open spreadsheet. Please check the spreadsheet ID and script permissions.');
  }
}

function getFormSheet_(sheetName) {
  const sh = openSpreadsheet_(FORM_ID).getSheetByName(sheetName);
  if (!sh) throw new Error(sheetName + ' sheet not found.');
  return sh;
}

function normalize_(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeUpper_(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeTelegramUsername_(value) {
  let username = String(value || '').trim();
  username = username.replace(/^https?:\/\/(?:www\.)?(?:t\.me|telegram\.me)\//i, '');
  username = username.split(/[/?#]/)[0].trim().replace(/^@+/, '');
  return username ? '@' + username.toLowerCase() : '';
}

function findHeaderIndex_(headers, names, fallbackIndex) {
  const lookup = {};
  (headers || []).forEach(function (header, index) {
    const key = normalize_(header);
    if (key && !Object.prototype.hasOwnProperty.call(lookup, key)) lookup[key] = index;
  });

  for (let i = 0; i < names.length; i++) {
    const key = normalize_(names[i]);
    if (Object.prototype.hasOwnProperty.call(lookup, key)) return lookup[key];
  }

  return fallbackIndex;
}

function validateEmail_(value, fieldName) {
  if (!EMAIL_REGEX.test(String(value || '').trim())) {
    throw new Error(fieldName + ' must be a valid email address.');
  }
}

function validateTelegramUsername_(value, fieldName) {
  const username = normalizeTelegramUsername_(value);
  if (!TELEGRAM_USERNAME_REGEX.test(username)) {
    throw new Error(fieldName + ' must be a valid Telegram username (for example, @username).');
  }
}

function validateUrl_(value, fieldName) {
  if (!URL_REGEX.test(String(value || '').trim())) {
    throw new Error(fieldName + ' must be a valid web link starting with http:// or https://');
  }
}

function validateHeesayLink_(value, fieldName, requiredPath) {
  const link = String(value || '').trim();
  validateUrl_(link, fieldName);
  const normalizedLink = link.toLowerCase();
  const allowedOrigins = [
    'https://international.heesay.com',
    'https://international.walla-app.com'
  ];
  let matchedOrigin = '';
  let suffix = '';
  allowedOrigins.some(function (origin) {
    if (normalizedLink.indexOf(origin) !== 0) return false;
    const candidateSuffix = normalizedLink.slice(origin.length);
    if (candidateSuffix && candidateSuffix.charAt(0) !== '/' && candidateSuffix.charAt(0) !== '?' && candidateSuffix.charAt(0) !== '#') return false;
    matchedOrigin = origin;
    suffix = candidateSuffix;
    return true;
  });
  if (!matchedOrigin) {
    throw new Error(fieldName + ' must use https://international.heesay.com/ or https://international.walla-app.com/');
  }
  if (requiredPath) {
    const path = suffix.split(/[?#]/)[0];
    if (path !== requiredPath && path.indexOf(requiredPath + '/') !== 0) {
      throw new Error(fieldName + ' must start with ' + matchedOrigin + requiredPath);
    }
  }
  return link;
}

function validateHeesayProfileLink_(value) {
  return validateHeesayLink_(value, 'Heesay Profile Link', '/user');
}

function validatePhone_(value, fieldName) {
  if (!PHONE_REGEX.test(String(value || '').trim())) {
    throw new Error(fieldName + ' must contain numbers only.');
  }
}

function validateUnicode_(value, fieldName) {
  if (!UNICODE_REGEX.test(String(value || '').trim())) {
    throw new Error(fieldName + ' must follow format like H25JB001');
  }
}

function cleanRegistrationLocationPart_(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function normalizeRegistrationLocation_(data) {
  const source = data || {};
  const region = cleanRegistrationLocationPart_(source.region || source.locationRegion || source.regRegion);
  const province = cleanRegistrationLocationPart_(source.province || source.locationProvince || source.regProvince);
  const city = cleanRegistrationLocationPart_(source.city || source.locationCity || source.regCity);
  const rawLocation = cleanRegistrationLocationPart_(source.location);
  let parts = [];

  if (region && province && city) return [region, province, city].join(' | ');

  parts = rawLocation.indexOf('|') !== -1
    ? rawLocation.split(/\s*\|\s*/)
    : rawLocation.split(/\s+-\s+/);

  parts = parts.map(cleanRegistrationLocationPart_);
  return parts.length === 3 ? parts.join(' | ') : rawLocation;
}

function validateRegistrationLocation_(location) {
  const parts = String(location || '').split(' | ').map(cleanRegistrationLocationPart_);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
    throw new Error('Please choose Region, Province, and City for Location.');
  }
}

function formatBirthdate_(value) {
  const parts = String(value || '').trim().split('-');
  if (parts.length !== 3) throw new Error('Birthday is invalid.');

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const date = new Date(year, month - 1, day);

  if (!year || !month || !day || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('Birthday is invalid.');
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const birthdayThisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());
  if (today < birthdayThisYear) age--;
  if (age <= 17 || age >= 60) throw new Error('Birthday is invalid.');

  return String(month).padStart(2, '0') + '/' + String(day).padStart(2, '0') + '/' + year;
}

function getSortTime_(value, displayValue, rowNumber) {
  if (value instanceof Date && !isNaN(value.getTime())) return value.getTime();
  const parsed = Date.parse(String(displayValue || value || '').trim());
  return !isNaN(parsed) ? parsed : Number(rowNumber) || 0;
}

function normalizeUrl_(value) {
  const url = String(value || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return 'https://' + url.replace(/^\/+/, '');
}

function normalizeUrlKey_(value) {
  return normalizeUrl_(value).toLowerCase().replace(/\/+$/, '');
}

function getCredentialRecordByEmail_(email) {
  const inputEmail = normalize_(email);
  let sh;
  let values;

  if (!inputEmail) return null;

  try {
    sh = openSpreadsheet_(SETTINGS_ID).getSheetByName(SETTINGS_SHEET);
  } catch (err) {
    return null;
  }
  if (!sh || sh.getLastRow() < 2) return null;

  values = sh.getRange(2, 1, sh.getLastRow() - 1, Math.max(9, sh.getLastColumn())).getDisplayValues();
  for (let i = 0; i < values.length; i++) {
    if (normalize_(values[i][1]) === inputEmail) {
      return {
        unicode: normalizeUpper_(values[i][0]),
        email: normalize_(values[i][1]),
        status: String(values[i][5] || '').trim(),
        role: String(values[i][6] || '').trim(),
        department: String(values[i][7] || '').trim(),
        team: String(values[i][8] || '').trim()
      };
    }
  }
  return null;
}

function getCredentialRecordByUnicode_(unicode) {
  const inputUnicode = normalizeUpper_(unicode);
  let sh;
  let values;

  if (!inputUnicode) return null;

  try {
    sh = openSpreadsheet_(SETTINGS_ID).getSheetByName(SETTINGS_SHEET);
  } catch (err) {
    return null;
  }
  if (!sh || sh.getLastRow() < 2) return null;

  values = sh.getRange(2, 1, sh.getLastRow() - 1, Math.max(9, sh.getLastColumn())).getDisplayValues();
  for (let i = 0; i < values.length; i++) {
    if (normalizeUpper_(values[i][0]) === inputUnicode) {
      return {
        unicode: inputUnicode,
        email: normalize_(values[i][1]),
        status: String(values[i][5] || '').trim(),
        role: String(values[i][6] || '').trim(),
        department: String(values[i][7] || '').trim(),
        team: String(values[i][8] || '').trim()
      };
    }
  }
  return null;
}

function getRecruitmentApprovalColumns_(values) {
  const headers = (values && values.length) ? (values[0] || []).map(normalize_) : [];
  return {
    timestampCol: findHeaderIndex_(headers, ['timestamp', 'time stamp'], 0),
    unicodeCol: findHeaderIndex_(headers, ['unicode of member', 'unicode member', 'unicode'], 2),
    statusCol: findHeaderIndex_(headers, ['status'], FORM_B_STATUS_COL - 1),
    reasonCol: findHeaderIndex_(headers, ['reason', 'rejection reason'], FORM_B_REASON_COL - 1),
    matchCol: findHeaderIndex_(headers, ['match'], FORM_B_MATCH_COL - 1)
  };
}

function getLatestFormBStatusByUnicode_(unicode) {
  const normalizedUnicode = normalizeUpper_(unicode);
  const sh = getFormSheet_(FORM_B);
  const lastRow = sh.getLastRow();
  const lastCol = Math.max(sh.getLastColumn(), FORM_B_MATCH_COL);
  let latestStatus = '';

  if (!normalizedUnicode || lastRow < 2) return latestStatus;

  const values = sh.getRange(1, 1, lastRow, lastCol).getValues();
  const cols = getRecruitmentApprovalColumns_(values);

  for (let i = 1; i < values.length; i++) {
    if (normalizeUpper_(values[i][cols.unicodeCol]) === normalizedUnicode) {
      latestStatus = String(values[i][cols.statusCol] || '').trim();
    }
  }

  return latestStatus;
}

function getLatestApprovedFormBTimeByUnicode_(unicode) {
  const normalizedUnicode = normalizeUpper_(unicode);
  const sh = getFormSheet_(FORM_B);
  const lastRow = sh.getLastRow();
  const lastCol = Math.max(sh.getLastColumn(), FORM_B_MATCH_COL);
  let latest = null;

  if (!normalizedUnicode || lastRow < 2) return latest;

  const values = sh.getRange(1, 1, lastRow, lastCol).getValues();
  const displayValues = sh.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  const cols = getRecruitmentApprovalColumns_(values);

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const display = displayValues[i] || row;
    const rowUnicode = normalizeUpper_(display[cols.unicodeCol] || row[cols.unicodeCol]);
    const status = normalize_(display[cols.statusCol] || row[cols.statusCol]);
    const sortTime = getSortTime_(row[cols.timestampCol], display[cols.timestampCol], i + 1);
    if (rowUnicode !== normalizedUnicode || status !== 'approved') continue;
    if (!latest || sortTime >= latest.sortTime) latest = { row: i + 1, status: status, sortTime: sortTime };
  }

  return latest;
}

function getLatestApprovedExitTimeByUnicode_(unicode) {
  const normalizedUnicode = normalizeUpper_(unicode);
  let sh;
  let latest = null;

  if (!normalizedUnicode) return latest;

  try {
    sh = getFormSheet_(FORM_C_EXIT);
  } catch (err) {
    return latest;
  }
  if (sh.getLastRow() < 2) return latest;

  const values = sh.getRange(1, 1, sh.getLastRow(), Math.max(10, sh.getLastColumn())).getValues();
  const displayValues = sh.getRange(1, 1, sh.getLastRow(), Math.max(10, sh.getLastColumn())).getDisplayValues();
  const headers = (values[0] || []).map(normalize_);
  const unicodeCol = findHeaderIndex_(headers, ['unicode of member', 'unicode member', 'unicode'], 3);
  const statusCol = findHeaderIndex_(headers, ['status'], 9);
  const effectiveDateCol = findHeaderIndex_(headers, ['effective date'], 5);
  const processedAtCol = findHeaderIndex_(headers, ['processed at', 'processed timestamp'], 17);
  const timestampCol = findHeaderIndex_(headers, ['timestamp'], 0);

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const display = displayValues[i] || row;
    const rowUnicode = normalizeUpper_(display[unicodeCol] || row[unicodeCol]);
    const status = String(display[statusCol] || row[statusCol] || '').trim();
    const sortTime = getSortTime_(
      row[effectiveDateCol] || row[processedAtCol] || row[timestampCol],
      display[effectiveDateCol] || display[processedAtCol] || display[timestampCol],
      i + 1
    );
    if (rowUnicode !== normalizedUnicode || normalize_(status) !== 'approved') continue;
    if (!latest || sortTime >= latest.sortTime) latest = { row: i + 1, status: 'Approved', sortTime: sortTime };
  }

  return latest;
}

function getCurrentMemberLifecycleStatusByUnicode_(unicode) {
  const normalizedUnicode = normalizeUpper_(unicode);
  if (!normalizedUnicode) return '';

  const latestApprovedRecruitment = getLatestApprovedFormBTimeByUnicode_(normalizedUnicode);
  const latestApprovedExit = getLatestApprovedExitTimeByUnicode_(normalizedUnicode);

  if (latestApprovedExit && (!latestApprovedRecruitment || latestApprovedExit.sortTime >= latestApprovedRecruitment.sortTime)) return 'Inactive';
  if (latestApprovedRecruitment) return 'Active';
  return '';
}

function isInactiveMemberStatus_(status) {
  const value = normalize_(status);
  return value === 'inactive' || value === 'deactivated' || value === 'disabled' || value === 'terminated';
}

function isActiveMemberStatus_(status) {
  const value = normalize_(status);
  return value === 'approved' || value === 'active';
}

function isRejectedMemberStatus_(status) {
  return normalize_(status) === 'rejected';
}

function isOpenRegistrationStatus_(status) {
  const value = normalize_(status);
  if (!value) return false;
  if (value === 'pending' || value === 'returned' || value === 'under review' || value === 'for approval' || value === 'for review') return true;
  if (value.indexOf('pending') !== -1 || value.indexOf('under review') !== -1 || value.indexOf('for approval') !== -1 || value.indexOf('for review') !== -1) return true;
  return false;
}

function throwRegistrationEmailBlockedByStatus_(status, sourceLabel) {
  const label = sourceLabel ? sourceLabel + ' ' : '';
  if (isActiveMemberStatus_(status)) {
    throw new Error('Email address is already registered to an active member.');
  }
  if (isOpenRegistrationStatus_(status)) {
    throw new Error('Email address already has a pending registration in ' + label.trim() + '.');
  }
}

function assertNoBlockingFormAEmailForOtp_(email) {
  const inputEmail = normalize_(email);
  const sh = getFormSheet_(FORM_A);
  const lastRow = sh.getLastRow();
  const lastCol = Math.max(sh.getLastColumn(), FORM_A_STATUS_COL);
  let values;
  let displayValues;
  let headers;
  let emailCol;
  let statusCol;
  let unicodeCol;

  if (!inputEmail || lastRow < 2) return;

  values = sh.getRange(1, 1, lastRow, lastCol).getValues();
  displayValues = sh.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  headers = (displayValues[0] || values[0] || []).map(normalize_);
  emailCol = findHeaderIndex_(headers, ['email address', 'email', 'e-mail address'], FORM_A_EMAIL_COL - 1);
  statusCol = findHeaderIndex_(headers, ['status', 'member status', 'registration status'], FORM_A_STATUS_COL - 1);
  unicodeCol = findHeaderIndex_(headers, ['unicode', 'unicode of member', 'unicode member'], FORM_A_UNICODE_COL - 1);

  for (let i = 1; i < values.length; i++) {
    const row = values[i] || [];
    const display = displayValues[i] || row;
    const rowEmail = normalize_(display[emailCol] || row[emailCol]);
    if (rowEmail !== inputEmail) continue;

    const formAStatus = String(display[statusCol] || row[statusCol] || '').trim();
    const unicode = normalizeUpper_(display[unicodeCol] || row[unicodeCol]);
    const formBStatus = unicode ? getLatestFormBStatusByUnicode_(unicode) : '';
    const lifecycleStatus = unicode ? getCurrentMemberLifecycleStatusByUnicode_(unicode) : '';

    if (lifecycleStatus === 'Active') throw new Error('Email address is already registered to an active member.');
    if (lifecycleStatus !== 'Inactive') {
      throwRegistrationEmailBlockedByStatus_(formAStatus, 'Form A');
      throwRegistrationEmailBlockedByStatus_(formBStatus, 'Form B');
    }
  }
}

function assertNoBlockingFormBEmailForOtp_(email) {
  const inputEmail = normalize_(email);
  const sh = getFormSheet_(FORM_B);
  const lastRow = sh.getLastRow();
  const lastCol = Math.max(sh.getLastColumn(), FORM_B_MATCH_COL);
  let values;
  let displayValues;
  let headers;
  let emailCol;
  let statusCol;

  if (!inputEmail || lastRow < 2) return;

  values = sh.getRange(1, 1, lastRow, lastCol).getValues();
  displayValues = sh.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  headers = (displayValues[0] || values[0] || []).map(normalize_);
  emailCol = findHeaderIndex_(headers, ['email address', 'email', 'e-mail address'], -1);
  if (emailCol < 0) return;
  statusCol = findHeaderIndex_(headers, ['status', 'member status', 'registration status'], FORM_B_STATUS_COL - 1);

  for (let i = 1; i < values.length; i++) {
    const row = values[i] || [];
    const display = displayValues[i] || row;
    const rowEmail = normalize_(display[emailCol] || row[emailCol]);
    if (rowEmail !== inputEmail) continue;
    throwRegistrationEmailBlockedByStatus_(String(display[statusCol] || row[statusCol] || '').trim(), 'Form B');
  }
}

function buildFormARegistrationRecord_(row, display, rowNumber) {
  const unicode = normalizeUpper_(display[FORM_A_UNICODE_COL - 1] || row[FORM_A_UNICODE_COL - 1]);
  const rowEmail = normalize_(row[FORM_A_EMAIL_COL - 1] || display[FORM_A_EMAIL_COL - 1]);
  const fbName = String(display[FORM_A_FB_NAME_COL - 1] || row[FORM_A_FB_NAME_COL - 1] || '').trim();
  const fbLink = normalizeUrl_(display[FORM_A_FB_LINK_COL - 1] || row[FORM_A_FB_LINK_COL - 1]);
  const formAStatus = String(display[FORM_A_STATUS_COL - 1] || row[FORM_A_STATUS_COL - 1] || '').trim();
  const formBStatus = getLatestFormBStatusByUnicode_(unicode);
  const lifecycleStatus = getCurrentMemberLifecycleStatusByUnicode_(unicode);
  const credentialRecord = (unicode ? getCredentialRecordByUnicode_(unicode) : null) || getCredentialRecordByEmail_(rowEmail) || {};
  const credentialStatus = String(credentialRecord.status || '').trim();
  const record = {
    row: rowNumber,
    unicode: unicode,
    email: rowEmail,
    fbName: fbName,
    fbNameKey: normalize_(fbName),
    fbLink: fbLink,
    fbLinkKey: normalizeUrlKey_(fbLink),
    status: formAStatus,
    formBStatus: formBStatus,
    lifecycleStatus: lifecycleStatus,
    credentialStatus: credentialStatus,
    reusable: isRejectedMemberStatus_(formAStatus) || isRejectedMemberStatus_(formBStatus)
  };

  record.inactiveMember = lifecycleStatus === 'Inactive' || isInactiveMemberStatus_(credentialStatus) || isInactiveMemberStatus_(formAStatus);
  record.activeMember = !record.inactiveMember && !record.reusable && (lifecycleStatus === 'Active' || isActiveMemberStatus_(credentialStatus) || isActiveMemberStatus_(formAStatus) || isActiveMemberStatus_(formBStatus));
  record.pendingOrReview = !record.reusable && !record.activeMember && (isOpenRegistrationStatus_(formAStatus) || isOpenRegistrationStatus_(formBStatus));
  return record;
}

function getFormARegistrationRecordsByMatcher_(matcher) {
  const sh = getFormSheet_(FORM_A);
  const lastRow = sh.getLastRow();
  const lastCol = Math.max(sh.getLastColumn(), FORM_A_STATUS_COL);
  const records = [];

  if (typeof matcher !== 'function' || lastRow < 2) return records;

  const values = sh.getRange(2, 1, lastRow - 1, lastCol).getValues();
  const displayValues = sh.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues();

  for (let i = 0; i < values.length; i++) {
    const record = buildFormARegistrationRecord_(values[i], displayValues[i], i + 2);
    if (matcher(record)) records.push(record);
  }

  return records;
}

function buildFastFormAEmailRecord_(row, display, rowNumber) {
  const unicode = normalizeUpper_(display[FORM_A_UNICODE_COL - 1] || row[FORM_A_UNICODE_COL - 1]);
  const rowEmail = normalize_(row[FORM_A_EMAIL_COL - 1] || display[FORM_A_EMAIL_COL - 1]);
  const fbName = String(display[FORM_A_FB_NAME_COL - 1] || row[FORM_A_FB_NAME_COL - 1] || '').trim();
  const fbLink = normalizeUrl_(display[FORM_A_FB_LINK_COL - 1] || row[FORM_A_FB_LINK_COL - 1]);
  const formAStatus = String(display[FORM_A_STATUS_COL - 1] || row[FORM_A_STATUS_COL - 1] || '').trim();
  const record = {
    row: rowNumber,
    unicode: unicode,
    email: rowEmail,
    fbName: fbName,
    fbNameKey: normalize_(fbName),
    fbLink: fbLink,
    fbLinkKey: normalizeUrlKey_(fbLink),
    status: formAStatus,
    formBStatus: '',
    lifecycleStatus: '',
    credentialStatus: '',
    reusable: false,
    inactiveMember: false,
    activeMember: false,
    pendingOrReview: false
  };

  if (isRejectedMemberStatus_(formAStatus)) {
    record.reusable = true;
    return record;
  }

  if (isInactiveMemberStatus_(formAStatus)) {
    record.inactiveMember = true;
    return record;
  }

  if (isActiveMemberStatus_(formAStatus)) {
    record.activeMember = true;
    return record;
  }

  if (isOpenRegistrationStatus_(formAStatus)) {
    record.pendingOrReview = true;
    return record;
  }

  return buildFormARegistrationRecord_(row, display, rowNumber);
}

function getFormAEmailRecords_(email, options) {
  const inputEmail = normalize_(email);
  const sh = getFormSheet_(FORM_A);
  const lastRow = sh.getLastRow();
  const lastCol = Math.max(sh.getLastColumn(), FORM_A_STATUS_COL);
  const records = [];
  const useFullStatus = !!(options && options.fullStatus);
  let emailValues;

  if (!inputEmail || lastRow < 2) return records;

  emailValues = sh.getRange(2, FORM_A_EMAIL_COL, lastRow - 1, 1).getDisplayValues();

  for (let i = 0; i < emailValues.length; i++) {
    if (normalize_(emailValues[i][0]) !== inputEmail) continue;

    const rowNumber = i + 2;
    const row = sh.getRange(rowNumber, 1, 1, lastCol).getValues()[0];
    const display = sh.getRange(rowNumber, 1, 1, lastCol).getDisplayValues()[0];
    records.push(useFullStatus ? buildFormARegistrationRecord_(row, display, rowNumber) : buildFastFormAEmailRecord_(row, display, rowNumber));
  }

  return records;
}

function getFormAFbLinkRecords_(fbLink, options) {
  const inputLink = normalizeUrlKey_(fbLink);
  const sh = getFormSheet_(FORM_A);
  const lastRow = sh.getLastRow();
  const lastCol = Math.max(sh.getLastColumn(), FORM_A_STATUS_COL);
  const records = [];
  const useFullStatus = !!(options && options.fullStatus);
  let linkValues;

  if (!inputLink || lastRow < 2) return records;

  linkValues = sh.getRange(2, FORM_A_FB_LINK_COL, lastRow - 1, 1).getDisplayValues();

  for (let i = 0; i < linkValues.length; i++) {
    if (normalizeUrlKey_(linkValues[i][0]) !== inputLink) continue;

    const rowNumber = i + 2;
    const row = sh.getRange(rowNumber, 1, 1, lastCol).getValues()[0];
    const display = sh.getRange(rowNumber, 1, 1, lastCol).getDisplayValues()[0];
    records.push(useFullStatus ? buildFormARegistrationRecord_(row, display, rowNumber) : buildFastFormAEmailRecord_(row, display, rowNumber));
  }

  return records;
}

function getFormAFbNameRecords_(fbName) {
  const inputName = normalize_(fbName);
  const sh = getFormSheet_(FORM_A);
  const lastRow = sh.getLastRow();
  const lastCol = Math.max(sh.getLastColumn(), FORM_A_STATUS_COL);
  const records = [];
  let nameValues;

  if (!inputName || lastRow < 2) return records;

  nameValues = sh.getRange(2, FORM_A_FB_NAME_COL, lastRow - 1, 1).getDisplayValues();

  for (let i = 0; i < nameValues.length; i++) {
    if (normalize_(nameValues[i][0]) !== inputName) continue;

    const rowNumber = i + 2;
    const row = sh.getRange(rowNumber, 1, 1, lastCol).getValues()[0];
    const display = sh.getRange(rowNumber, 1, 1, lastCol).getDisplayValues()[0];
    records.push(buildFastFormAEmailRecord_(row, display, rowNumber));
  }

  return records;
}

function getBlockingFormARegistrationRecord_(records) {
  const list = records || [];
  for (let i = 0; i < list.length; i++) if (list[i].activeMember) return list[i];
  for (let i = 0; i < list.length; i++) if (list[i].pendingOrReview) return list[i];
  return null;
}

function getActiveFormARegistrationRecord_(records) {
  const list = records || [];
  for (let i = 0; i < list.length; i++) if (list[i].activeMember) return list[i];
  return null;
}

function assertNoActiveFormARegistrationRecords_(records, fieldLabel) {
  const activeRecord = getActiveFormARegistrationRecord_(records);
  if (!activeRecord) return;
  if (fieldLabel === 'Email address') {
    throw new Error('Email address is already registered to an active member.');
  }
  throw new Error('FB Link is already used by an active member. Active members cannot register again using the same FB Link.');
}

function assertNoActiveMemberRegistrationMatches_(email, fbLink) {
  assertNoActiveFormARegistrationRecords_(getFormAEmailRecords_(email, { fullStatus: true }), 'Email address');
  assertNoActiveFormARegistrationRecords_(getFormAFbLinkRecords_(fbLink, { fullStatus: true }), 'FB Link');
}

function getLatestReusableFormARegistrationRecord_(records) {
  let latest = null;
  (records || []).forEach(function (record) {
    if (!record || (!record.reusable && !record.inactiveMember)) return;
    if (!latest || Number(record.row || 0) >= Number(latest.row || 0)) latest = record;
  });
  return latest;
}

function assertNoBlockingFormARegistrationRecords_(records, fieldLabel) {
  const blockingRecord = getBlockingFormARegistrationRecord_(records);
  if (!blockingRecord) return;
  if (blockingRecord.activeMember) {
    if (fieldLabel === 'Email address') {
      throw new Error('Email address is already registered to an active member.');
    }
    throw new Error(fieldLabel + ' is already used by an active member. Active members cannot register again using the same ' + fieldLabel.toLowerCase() + '.');
  }
  if (fieldLabel === 'Email address') {
    throw new Error('Email address is already registered and is still pending or under review.');
  }
  throw new Error(fieldLabel + ' is already registered and is still pending or under review. Contact any recruitment admin for assistance.');
}

function getReusableFormAEmailRecord_(email) {
  const records = getFormAEmailRecords_(email);
  assertNoActiveMemberRegistrationMatches_(email, '');
  return getLatestReusableFormARegistrationRecord_(records);
}

function getReusableFormARegistrationRecord_(email, fbLink, fbName) {
  const groups = [
    { field: 'Email address', records: getFormAEmailRecords_(email) },
    { field: 'FB Link', records: getFormAFbLinkRecords_(fbLink) }
  ];
  const reusableRecords = [];
  const seenRows = {};
  let selected = null;

  groups.forEach(function (group) {
    const reusable = getLatestReusableFormARegistrationRecord_(group.records);
    if (reusable && !seenRows[reusable.row]) {
      seenRows[reusable.row] = true;
      reusableRecords.push(reusable);
    }
  });

  reusableRecords.forEach(function (record) {
    if (!selected) {
      selected = record;
      return;
    }
    if (record.unicode && selected.unicode && record.unicode !== selected.unicode) {
      throw new Error('The email address or FB Link matches different inactive member records. Please contact recruitment admin to confirm the correct Unicode.');
    }
    if (Number(record.row || 0) > Number(selected.row || 0)) selected = record;
  });

  return selected;
}

function getIkonixRegistrationRows_() {
  const sh = getFormSheet_(FORM_A);
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return [];
  return sh.getRange(2, 1, lastRow - 1, IKONIX_STATUS_COL).getValues();
}

function isBlockingIkonixRegistrationStatus_(status) {
  const value = String(status || '').trim();
  return !value || (!isInactiveMemberStatus_(value) && !isRejectedMemberStatus_(value));
}

function assertIkonixRegistrationAvailable_(email, heesayProfileLink) {
  const emailKey = normalize_(email);
  const linkKey = normalizeUrlKey_(heesayProfileLink);
  const rows = getIkonixRegistrationRows_();

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const status = row[IKONIX_STATUS_COL - 1];
    if (!isBlockingIkonixRegistrationStatus_(status)) continue;
    if (emailKey && normalize_(row[IKONIX_EMAIL_COL - 1]) === emailKey) {
      throw new Error('Email address is already registered and is still active, pending, or under review.');
    }
    if (linkKey && normalizeUrlKey_(row[IKONIX_HEESAY_PROFILE_COL - 1]) === linkKey) {
      throw new Error('Heesay Profile Link is already registered and is still active, pending, or under review.');
    }
  }
}

function ensureFormAEmailAvailable_(email) {
  const inputEmail = normalize_(email);
  const credentialRecord = getCredentialRecordByEmail_(inputEmail);
  const credentialStatus = credentialRecord ? String(credentialRecord.status || '').trim() : '';

  if (credentialStatus && !isInactiveMemberStatus_(credentialStatus) && !isRejectedMemberStatus_(credentialStatus)) {
    if (isActiveMemberStatus_(credentialStatus)) {
      throw new Error('Email address is already registered to an active member.');
    }
    if (isOpenRegistrationStatus_(credentialStatus)) {
      throw new Error('Email address is already registered and is still pending or under review.');
    }
  }

  assertIkonixRegistrationAvailable_(inputEmail, '');
}

function getCredentialRecordByTelegramUsername_(telegramUsername) {
  const inputTelegramUsername = normalizeTelegramUsername_(telegramUsername);
  let sh;
  let values;

  if (!inputTelegramUsername) return null;
  try {
    sh = openSpreadsheet_(SETTINGS_ID).getSheetByName(SETTINGS_SHEET);
  } catch (err) {
    return null;
  }
  if (!sh || sh.getLastRow() < 2) return null;

  values = sh.getRange(1, 1, sh.getLastRow(), Math.max(9, sh.getLastColumn())).getDisplayValues();
  const headers = (values[0] || []).map(normalize_);
  const usernameCol = findHeaderIndex_(
    headers,
    ['telegram user name', 'telegram username', 'telegram', 'tg username'],
    1
  );
  const statusCol = findHeaderIndex_(headers, ['status', 'member status'], 5);

  for (let i = 1; i < values.length; i += 1) {
    if (normalizeTelegramUsername_(values[i][usernameCol]) === inputTelegramUsername) {
      return {
        telegramUsername: inputTelegramUsername,
        status: String(values[i][statusCol] || '').trim()
      };
    }
  }
  return null;
}

function ensureIkonixTelegramAvailable_(telegramUsername) {
  const inputTelegramUsername = normalizeTelegramUsername_(telegramUsername);
  const credentialRecord = getCredentialRecordByTelegramUsername_(inputTelegramUsername);
  const credentialStatus = credentialRecord ? String(credentialRecord.status || '').trim() : '';
  const rows = getIkonixRegistrationRows_();

  validateTelegramUsername_(inputTelegramUsername, 'TG Username');
  if (credentialStatus && !isInactiveMemberStatus_(credentialStatus) && !isRejectedMemberStatus_(credentialStatus)) {
    if (isActiveMemberStatus_(credentialStatus)) {
      throw new Error('TG Username is already registered to an active member.');
    }
    if (isOpenRegistrationStatus_(credentialStatus)) {
      throw new Error('TG Username is already registered and is still pending or under review.');
    }
  }

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] || [];
    if (!isBlockingIkonixRegistrationStatus_(row[IKONIX_STATUS_COL - 1])) continue;
    if (normalizeTelegramUsername_(row[IKONIX_TG_USERNAME_COL - 1]) === inputTelegramUsername) {
      throw new Error('TG Username is already registered and is still active, pending, or under review.');
    }
  }
}

function getFormATimestampYear_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return value.getFullYear();
  const parsed = Date.parse(String(value || '').trim());
  return !isNaN(parsed) ? new Date(parsed).getFullYear() : 0;
}

function getExistingFormAUnicodes_(sheet) {
  const seen = {};
  if (sheet.getLastRow() < 2) return seen;
  sheet.getRange(2, FORM_A_UNICODE_COL, sheet.getLastRow() - 1, 1).getDisplayValues().forEach(function (row) {
    const unicode = normalizeUpper_(row[0]);
    if (unicode) seen[unicode] = true;
  });
  return seen;
}

function getNextFormAYearlySequence_(sheet, year) {
  let count = 0;
  if (!year || sheet.getLastRow() < 2) return 1;
  sheet.getRange(2, FORM_A_TIMESTAMP_COL, sheet.getLastRow() - 1, 1).getValues().forEach(function (row) {
    if (getFormATimestampYear_(row[0]) === year) count++;
  });
  return count + 1;
}

function generateFormAUnicode_(sheet, timestampDate, firstName, lastName) {
  const year = Number(Utilities.formatDate(timestampDate, Session.getScriptTimeZone(), 'yyyy'));
  const yearSuffix = String(year).slice(-2);
  const initials = (String(firstName || '').charAt(0) + String(lastName || '').charAt(0)).toUpperCase();
  const existingUnicodes = getExistingFormAUnicodes_(sheet);
  let sequence = getNextFormAYearlySequence_(sheet, year);
  let unicode = '';

  do {
    unicode = 'H' + yearSuffix + initials + String(sequence).padStart(3, '0');
    sequence++;
  } while (existingUnicodes[unicode]);

  return unicode;
}

function copyFormulaDown_(sheet, row, col) {
  if (row <= 1) return;
  const source = sheet.getRange(row - 1, col);
  const formula = source.getFormula();
  if (formula) source.copyTo(sheet.getRange(row, col), { contentsOnly: false });
}

function getRegistrationEmailHash_(email) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, normalize_(email));
  return bytes.map(function (byte) {
    return ('0' + ((byte + 256) % 256).toString(16)).slice(-2);
  }).join('');
}

function getRegistrationOtpCacheKey_(email) {
  return 'htrk_registration_otp_' + getRegistrationEmailHash_(email);
}

function getRegistrationVerifiedCacheKey_(method, identity) {
  const otpMethod = normalize_(method) === 'telegram' ? 'telegram' : 'email';
  const normalizedIdentity = otpMethod === 'telegram'
    ? normalizeTelegramUsername_(identity)
    : normalize_(identity);
  return normalizedIdentity
    ? 'ikonix_registration_verified_' + otpMethod + '_' + getRegistrationIdentityHash_(normalizedIdentity)
    : '';
}

function getRegistrationOtpPayload_(email) {
  const raw = CacheService.getScriptCache().get(getRegistrationOtpCacheKey_(email));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function verifyRegistrationOtp_(email, otp, consume) {
  const inputEmail = normalize_(email);
  const inputOtp = String(otp || '').trim();
  const payload = getRegistrationOtpPayload_(inputEmail);

  if (!inputOtp) throw new Error('Please enter the OTP sent to your email.');
  if (!payload || payload.email !== inputEmail || Number(payload.expiresAt || 0) < new Date().getTime()) {
    throw new Error('OTP expired. Please send a new OTP.');
  }
  if (String(payload.otp || '') !== inputOtp) throw new Error('Invalid OTP. Please check the code sent to your email.');
  if (consume) CacheService.getScriptCache().remove(getRegistrationOtpCacheKey_(inputEmail));
}

function getRegistrationIdentityHash_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, normalize_(value));
  return bytes.map(function (byte) {
    return ('0' + ((byte + 256) % 256).toString(16)).slice(-2);
  }).join('');
}

function getRegistrationTelegramOtpCacheKey_(telegramUsername) {
  return 'ikonix_registration_telegram_otp_' + getRegistrationIdentityHash_(normalizeTelegramUsername_(telegramUsername));
}

function getRegistrationTelegramOtpPayload_(telegramUsername) {
  const raw = CacheService.getScriptCache().get(getRegistrationTelegramOtpCacheKey_(telegramUsername));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function verifyRegistrationTelegramOtp_(telegramUsername, otp, consume) {
  const inputTelegramUsername = normalizeTelegramUsername_(telegramUsername);
  const inputOtp = String(otp || '').trim();
  const payload = getRegistrationTelegramOtpPayload_(inputTelegramUsername);

  if (!inputOtp) throw new Error('Please enter the OTP sent to your Telegram account.');
  if (
    !payload ||
    normalizeTelegramUsername_(payload.telegramUsername) !== inputTelegramUsername ||
    Number(payload.expiresAt || 0) < new Date().getTime()
  ) {
    throw new Error('OTP expired. Please send a new Telegram OTP.');
  }
  if (String(payload.otp || '') !== inputOtp) {
    throw new Error('Invalid OTP. Please check the code sent to your Telegram account.');
  }
  if (consume) CacheService.getScriptCache().remove(getRegistrationTelegramOtpCacheKey_(inputTelegramUsername));
  return payload;
}

function markRegistrationOtpVerified_(method, otpIdentity) {
  const otpMethod = normalize_(method) === 'telegram' ? 'telegram' : 'email';
  const identity = otpMethod === 'telegram'
    ? normalizeTelegramUsername_(otpIdentity)
    : normalize_(otpIdentity);
  const cacheKey = getRegistrationVerifiedCacheKey_(otpMethod, identity);
  if (!identity || !cacheKey) return;
  CacheService.getScriptCache().put(
    cacheKey,
    JSON.stringify({ method: otpMethod, identity: identity, verifiedAt: new Date().getTime() }),
    REGISTRATION_VERIFIED_TTL_SECONDS
  );
}

function assertRegistrationOtpAlreadyVerified_(method, otpIdentity) {
  const expectedMethod = normalize_(method) === 'telegram' ? 'telegram' : 'email';
  const expectedIdentity = expectedMethod === 'telegram'
    ? normalizeTelegramUsername_(otpIdentity)
    : normalize_(otpIdentity);
  const cacheKey = getRegistrationVerifiedCacheKey_(expectedMethod, expectedIdentity);
  const raw = cacheKey ? CacheService.getScriptCache().get(cacheKey) : '';
  let payload;
  const errorMessage = expectedMethod === 'telegram'
    ? 'Please verify the Telegram OTP before submitting.'
    : 'Please verify the email OTP before submitting.';

  if (!raw) throw new Error(errorMessage);
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    throw new Error(errorMessage);
  }
  const payloadMethod = normalize_(payload && payload.method) || 'email';
  const payloadIdentity = payloadMethod === 'telegram'
    ? normalizeTelegramUsername_(payload && payload.identity)
    : normalize_(payload && payload.identity);
  if (!payload || payloadMethod !== expectedMethod || payloadIdentity !== expectedIdentity) {
    throw new Error(errorMessage);
  }
}

function clearRegistrationOtpVerified_(method, otpIdentity) {
  const cacheKey = getRegistrationVerifiedCacheKey_(method, otpIdentity);
  if (cacheKey) CacheService.getScriptCache().remove(cacheKey);
}

function getTelegramBotToken_() {
  const token = String(PropertiesService.getScriptProperties().getProperty(TELEGRAM_BOT_TOKEN_PROPERTY) || '').trim();
  if (!token) {
    throw new Error('Telegram OTP is not configured. Ask an administrator to add the TELEGRAM_BOT_TOKEN Script Property.');
  }
  return token;
}

function callTelegramBotApi_(method, payload) {
  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + getTelegramBotToken_() + '/' + method, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload || {}),
    muteHttpExceptions: true
  });
  const responseCode = response.getResponseCode();
  let result;

  try {
    result = JSON.parse(response.getContentText() || '{}');
  } catch (err) {
    result = {};
  }
  if (responseCode < 200 || responseCode >= 300 || !result.ok) {
    throw new Error(String(result.description || 'Telegram Bot API request failed.'));
  }
  return result.result;
}

function getTelegramBotIdentity_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(TELEGRAM_BOT_CACHE_KEY);
  let identity;

  if (cached) {
    try {
      identity = JSON.parse(cached);
      if (identity && identity.username) return identity;
    } catch (err) {}
  }
  identity = callTelegramBotApi_('getMe', {});
  cache.put(TELEGRAM_BOT_CACHE_KEY, JSON.stringify(identity), 6 * 60 * 60);
  return identity;
}

function getTelegramChatPropertyKey_(telegramUsername) {
  return TELEGRAM_CHAT_PROPERTY_PREFIX + getRegistrationIdentityHash_(normalizeTelegramUsername_(telegramUsername));
}

function saveTelegramChatMapping_(telegramUsername, chatId, userId) {
  const inputTelegramUsername = normalizeTelegramUsername_(telegramUsername);
  if (!inputTelegramUsername || !TELEGRAM_USERNAME_REGEX.test(inputTelegramUsername) || !chatId) return;
  PropertiesService.getScriptProperties().setProperty(
    getTelegramChatPropertyKey_(inputTelegramUsername),
    JSON.stringify({
      telegramUsername: inputTelegramUsername,
      chatId: String(chatId),
      userId: String(userId || ''),
      updatedAt: new Date().getTime()
    })
  );
}

function getTelegramChatMapping_(telegramUsername) {
  const inputTelegramUsername = normalizeTelegramUsername_(telegramUsername);
  const raw = inputTelegramUsername
    ? PropertiesService.getScriptProperties().getProperty(getTelegramChatPropertyKey_(inputTelegramUsername))
    : '';
  let mapping;

  if (!raw) return null;
  try {
    mapping = JSON.parse(raw);
  } catch (err) {
    PropertiesService.getScriptProperties().deleteProperty(getTelegramChatPropertyKey_(inputTelegramUsername));
    return null;
  }
  if (
    !mapping ||
    normalizeTelegramUsername_(mapping.telegramUsername) !== inputTelegramUsername ||
    !mapping.chatId ||
    new Date().getTime() - Number(mapping.updatedAt || 0) > TELEGRAM_CHAT_LINK_TTL_MS
  ) {
    PropertiesService.getScriptProperties().deleteProperty(getTelegramChatPropertyKey_(inputTelegramUsername));
    return null;
  }
  return mapping;
}

function clearTelegramChatMapping_(telegramUsername) {
  const inputTelegramUsername = normalizeTelegramUsername_(telegramUsername);
  if (inputTelegramUsername) {
    PropertiesService.getScriptProperties().deleteProperty(getTelegramChatPropertyKey_(inputTelegramUsername));
  }
}

function handleTelegramWebhookUpdate_(update) {
  trackTelegramGroupFromUpdate_(update);
  const message = update && (update.message || update.edited_message);
  const from = message && message.from;
  const chat = message && message.chat;
  const telegramUsername = from ? normalizeTelegramUsername_(from.username) : '';
  const messageText = String(message && message.text || '').trim();

  const chatType = String(chat && chat.type || '');
  const isGroupChat = chatType === 'group' || chatType === 'supergroup';
  if (message && chat && isGroupChat) {
    if (/^\/ikonixsync(?:@\w+)?(?:\s|$)/i.test(messageText)) {
      callTelegramBotApi_('sendMessage', {
        chat_id: String(chat.id),
        text: 'IKONIX Portal connected this group. Return to Post Announcement and tap Refresh Group Chats.'
      });
    }
    return;
  }

  if (!message || !from || !chat || chatType !== 'private') return;
  if (!telegramUsername || !TELEGRAM_USERNAME_REGEX.test(telegramUsername)) {
    if (/^\/start(?:@\w+)?(?:\s|$)/i.test(messageText)) {
      callTelegramBotApi_('sendMessage', {
        chat_id: String(chat.id),
        text: 'Please create a Telegram username in Settings, then return here and tap Start again.'
      });
    }
    return;
  }

  saveTelegramChatMapping_(telegramUsername, chat.id, from.id);
  if (/^\/start(?:@\w+)?(?:\s|$)/i.test(messageText)) {
    callTelegramBotApi_('sendMessage', {
      chat_id: String(chat.id),
      text: 'Your Telegram username ' + telegramUsername + ' is connected. Return to IKONIX Registration and tap Send Telegram OTP.'
    });
  }
}

function getTelegramWebhookUrl_() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const configuredWebAppUrl = String(scriptProperties.getProperty(TELEGRAM_WEB_APP_URL_PROPERTY) || '').trim();
  const serviceUrl = String(configuredWebAppUrl || ScriptApp.getService().getUrl() || '')
    .trim()
    .replace(/[?#].*$/, '');
  let webhookKey = String(scriptProperties.getProperty(TELEGRAM_WEBHOOK_KEY_PROPERTY) || '').trim();

  if (!serviceUrl) throw new Error('Deploy this Apps Script as a web app before configuring the Telegram webhook.');
  if (/\/dev$/i.test(serviceUrl)) {
    throw new Error(TELEGRAM_WEB_APP_URL_PROPERTY + ' must be the deployed IKONIX web-app URL ending in /exec.');
  }
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/i.test(serviceUrl)) {
    throw new Error(TELEGRAM_WEB_APP_URL_PROPERTY + ' must be the complete Apps Script web-app URL ending in /exec.');
  }
  if (!webhookKey) {
    webhookKey = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    scriptProperties.setProperty(TELEGRAM_WEBHOOK_KEY_PROPERTY, webhookKey);
  }
  return serviceUrl + '?telegramWebhookKey=' + encodeURIComponent(webhookKey);
}

function setTelegramBotWebhook_(webhookUrl) {
  return callTelegramBotApi_('setWebhook', {
    url: String(webhookUrl || getTelegramWebhookUrl_()),
    allowed_updates: TELEGRAM_REQUIRED_ALLOWED_UPDATES
  });
}

function ensureTelegramBotWebhookConfigured_() {
  const expectedUrl = getTelegramWebhookUrl_();
  let info = callTelegramBotApi_('getWebhookInfo', {}) || {};
  if (String(info.url || '') !== expectedUrl) {
    setTelegramBotWebhook_(expectedUrl);
    info = callTelegramBotApi_('getWebhookInfo', {}) || {};
  }
  return {
    ready: String(info.url || '') === expectedUrl,
    pendingUpdateCount: Number(info.pending_update_count || 0),
    lastErrorDate: Number(info.last_error_date || 0),
    lastErrorMessage: String(info.last_error_message || '')
  };
}

function getRegistrationTelegramBotInfo() {
  const token = String(PropertiesService.getScriptProperties().getProperty(TELEGRAM_BOT_TOKEN_PROPERTY) || '').trim();
  if (!token) {
    return { configured: false, message: 'Telegram OTP is not configured. Please contact an administrator.' };
  }
  const bot = getTelegramBotIdentity_();
  let webhookStatus;
  try {
    webhookStatus = ensureTelegramBotWebhookConfigured_();
  } catch (err) {
    return {
      configured: true,
      webhookReady: false,
      username: '@' + String(bot.username || ''),
      startUrl: 'https://t.me/' + String(bot.username || '') + '?start=register',
      message: 'Telegram bot connection needs administrator attention: ' + String(err && err.message ? err.message : err)
    };
  }
  return {
    configured: true,
    webhookReady: webhookStatus.ready,
    username: '@' + String(bot.username || ''),
    startUrl: 'https://t.me/' + String(bot.username || '') + '?start=register',
    message: webhookStatus.ready
      ? 'Open @' + String(bot.username || '') + ', tap Start, wait for the connected confirmation, then return here.'
      : 'Telegram webhook is not ready. Please contact an administrator.'
  };
}

function configureTelegramBotWebhook() {
  const webhookUrl = getTelegramWebhookUrl_();
  const result = setTelegramBotWebhook_(webhookUrl);
  return {
    ok: !!result,
    webhookUrl: webhookUrl.split('?')[0],
    message: 'Telegram webhook configured for IKONIX Registration.'
  };
}

function probeTelegramWebhookEndpoint_() {
  const response = UrlFetchApp.fetch(getTelegramWebhookUrl_(), {
    method: 'post',
    contentType: 'application/json',
    payload: '{}',
    followRedirects: false,
    muteHttpExceptions: true
  });
  return { httpStatus: response.getResponseCode() };
}

function diagnoseTelegramBotSetup() {
  const bot = getTelegramBotIdentity_();
  const expectedUrl = getTelegramWebhookUrl_();
  const info = callTelegramBotApi_('getWebhookInfo', {}) || {};
  let endpointProbe;
  try {
    endpointProbe = probeTelegramWebhookEndpoint_();
  } catch (err) {
    endpointProbe = { httpStatus: 0, error: String(err && err.message ? err.message : err) };
  }
  const summary = {
    botUsername: '@' + String(bot.username || ''),
    deployedWebAppUrl: expectedUrl.split('?')[0],
    webhookMatchesDeployment: String(info.url || '') === expectedUrl,
    webhookHttpStatus: Number(endpointProbe.httpStatus || 0),
    webhookProbeError: String(endpointProbe.error || ''),
    pendingUpdateCount: Number(info.pending_update_count || 0),
    lastErrorDate: Number(info.last_error_date || 0),
    lastErrorMessage: String(info.last_error_message || '')
  };
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

function sendRegistrationOtp(email) {
  const inputEmail = normalize_(email);
  if (!inputEmail) throw new Error('Please enter your email address first.');

  validateEmail_(inputEmail, 'Email Address');
  ensureFormAEmailAvailable_(inputEmail);

  const now = new Date().getTime();
  const existingPayload = getRegistrationOtpPayload_(inputEmail);
  if (existingPayload && Number(existingPayload.sentAt || 0)) {
    const waitSeconds = REGISTRATION_OTP_RESEND_SECONDS - Math.floor((now - Number(existingPayload.sentAt)) / 1000);
    if (waitSeconds > 0) throw new Error('Please wait ' + waitSeconds + ' second(s) before sending another OTP.');
  }

  const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  CacheService.getScriptCache().put(
    getRegistrationOtpCacheKey_(inputEmail),
    JSON.stringify({ email: inputEmail, otp: otp, sentAt: now, expiresAt: now + (REGISTRATION_OTP_TTL_SECONDS * 1000) }),
    REGISTRATION_OTP_TTL_SECONDS
  );

  MailApp.sendEmail({
    to: inputEmail,
    subject: 'IKONIX Registration OTP',
    body: [
      'Dear IKONIX Applicant:',
      '',
      'Your one-time password (OTP) for the Member Registration form is:',
      '',
      otp,
      '',
      'This code will expire in 10 minutes. Please do not share this code with anyone.',
      '',
      'Thank you,',
      'IKONIX Registration'
    ].join('\n')
  });

  return {
    ok: true,
    cooldownSeconds: REGISTRATION_OTP_RESEND_SECONDS,
    message: 'OTP sent to ' + inputEmail + '. Please check your email and enter the code.'
  };
}

function verifyRegistrationOtp(email, otp) {
  const inputEmail = normalize_(email);
  if (!inputEmail) throw new Error('Please enter your email address first.');
  validateEmail_(inputEmail, 'Email Address');
  ensureFormAEmailAvailable_(inputEmail);
  verifyRegistrationOtp_(inputEmail, otp, true);
  markRegistrationOtpVerified_('email', inputEmail);
  return { ok: true, method: 'email', message: 'Email OTP verified. Please continue to the registration details.' };
}

function sendRegistrationTelegramOtp(telegramUsername) {
  const inputTelegramUsername = normalizeTelegramUsername_(telegramUsername);
  if (!inputTelegramUsername) throw new Error('Please enter your TG Username first.');

  validateTelegramUsername_(inputTelegramUsername, 'TG Username');
  ensureIkonixTelegramAvailable_(inputTelegramUsername);
  const webhookStatus = ensureTelegramBotWebhookConfigured_();
  if (!webhookStatus.ready) {
    throw new Error('Telegram webhook is not connected to this deployment. Please contact an administrator.');
  }

  const now = new Date().getTime();
  const existingPayload = getRegistrationTelegramOtpPayload_(inputTelegramUsername);
  if (existingPayload && Number(existingPayload.sentAt || 0)) {
    const waitSeconds = REGISTRATION_OTP_RESEND_SECONDS - Math.floor((now - Number(existingPayload.sentAt)) / 1000);
    if (waitSeconds > 0) throw new Error('Please wait ' + waitSeconds + ' second(s) before sending another OTP.');
  }

  const chatMapping = getTelegramChatMapping_(inputTelegramUsername) ||
    (existingPayload && existingPayload.chatId ? { chatId: String(existingPayload.chatId) } : null);
  if (!chatMapping) {
    const bot = getTelegramBotIdentity_();
    const webhookError = webhookStatus.lastErrorMessage
      ? ' Telegram reported: ' + webhookStatus.lastErrorMessage + '.'
      : '';
    throw new Error(
      'Telegram account not connected. Open @' + bot.username +
      ', tap Start, wait for its connected confirmation, then return here and tap Send Telegram OTP again.' +
      webhookError
    );
  }

  const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  try {
    callTelegramBotApi_('sendMessage', {
      chat_id: chatMapping.chatId,
      text: [
        'IKONIX Registration OTP',
        '',
        'Your one-time password is: ' + otp,
        '',
        'This code expires in 10 minutes. Do not share it with anyone.'
      ].join('\n'),
      protect_content: true
    });
  } catch (err) {
    throw new Error('Unable to send the OTP in Telegram. Open the IKONIX bot, tap Start, and try again.');
  }

  CacheService.getScriptCache().put(
    getRegistrationTelegramOtpCacheKey_(inputTelegramUsername),
    JSON.stringify({
      telegramUsername: inputTelegramUsername,
      chatId: String(chatMapping.chatId),
      otp: otp,
      sentAt: now,
      expiresAt: now + (REGISTRATION_OTP_TTL_SECONDS * 1000)
    }),
    REGISTRATION_OTP_TTL_SECONDS
  );
  clearTelegramChatMapping_(inputTelegramUsername);

  return {
    ok: true,
    method: 'telegram',
    telegramUsername: inputTelegramUsername,
    cooldownSeconds: REGISTRATION_OTP_RESEND_SECONDS,
    message: 'OTP sent to ' + inputTelegramUsername + ' in Telegram. Enter the 6-digit code to continue.'
  };
}

function verifyRegistrationTelegramOtp(telegramUsername, otp) {
  const inputTelegramUsername = normalizeTelegramUsername_(telegramUsername);
  if (!inputTelegramUsername) throw new Error('Please enter your TG Username first.');

  validateTelegramUsername_(inputTelegramUsername, 'TG Username');
  ensureIkonixTelegramAvailable_(inputTelegramUsername);
  const verifiedPayload = verifyRegistrationTelegramOtp_(inputTelegramUsername, otp, true);
  if (verifiedPayload && verifiedPayload.chatId) {
    saveTelegramNotificationChat_(inputTelegramUsername, verifiedPayload.chatId);
  }
  markRegistrationOtpVerified_('telegram', inputTelegramUsername);
  clearTelegramChatMapping_(inputTelegramUsername);
  return {
    ok: true,
    method: 'telegram',
    telegramUsername: inputTelegramUsername,
    message: 'Telegram OTP verified. Please continue to the registration details.'
  };
}

function checkRegistrationMemberAvailability(data) {
  const source = data || {};
  const otpMethod = normalize_(source.otpMethod) === 'telegram' ? 'telegram' : 'email';
  const emailAddress = normalize_(source.emailAddress);
  const tgUsername = normalizeTelegramUsername_(source.tgUsername);
  const heesayProfileLink = String(source.heesayProfileLink || '').trim();

  if (otpMethod === 'email' && !emailAddress) throw new Error('Please enter your email address.');
  if (otpMethod === 'telegram' && !tgUsername) throw new Error('Please enter your TG Username.');
  if (!heesayProfileLink) throw new Error('Please enter your Heesay Profile Link.');

  if (emailAddress) {
    validateEmail_(emailAddress, 'Email Address');
    ensureFormAEmailAvailable_(emailAddress);
  }
  if (tgUsername) {
    validateTelegramUsername_(tgUsername, 'TG Username');
    ensureIkonixTelegramAvailable_(tgUsername);
  }
  validateHeesayProfileLink_(heesayProfileLink);
  assertIkonixRegistrationAvailable_('', heesayProfileLink);

  return { ok: true, message: 'Registration details are available.' };
}

function createIkonixRegistrationPhoto_(photo, heesayId) {
  if (!photo || !photo.data) return null;
  const mimeType = String(photo.mimeType || '').toLowerCase();
  const allowedTypes = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
  if (!allowedTypes[mimeType]) throw new Error('Photo must be a JPG, PNG, or WEBP image.');

  const base64 = String(photo.data || '').replace(/^data:image\/[a-z0-9.+-]+;base64,/i, '');
  const bytes = Utilities.base64Decode(base64);
  if (!bytes.length) throw new Error('The selected photo is empty.');
  if (bytes.length > IKONIX_MAX_PHOTO_BYTES) throw new Error('Photo must be 5 MB or smaller.');

  const safeId = String(heesayId || 'member').replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 60) || 'member';
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
  const fileName = 'IKONIX_DP_' + safeId + '_' + stamp + allowedTypes[mimeType];
  const blob = Utilities.newBlob(bytes, mimeType, fileName);
  const file = DriveApp.getFolderById(IKONIX_PHOTO_FOLDER_ID).createFile(blob);
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (sharingErr) {
    // The parent folder may already provide public access, or organization policy may control sharing.
  }
  return file;
}

function submitRegistrationForm(data) {
  if (!data) throw new Error('No form data received.');

  const otpMethod = normalize_(data.otpMethod) === 'telegram' ? 'telegram' : 'email';
  const emailAddress = normalize_(data.emailAddress);
  const firstName = String(data.firstName || '').trim();
  const middleInitial = String(data.middleInitial || '').trim();
  const lastName = String(data.lastName || '').trim();
  const tgUsername = normalizeTelegramUsername_(data.tgUsername);
  const heesayName = String(data.heesayName || '').trim();
  const heesayId = String(data.heesayId || '').trim();
  const requestedType = String(data.locationType || '').trim();
  const locationType = /^local$/i.test(requestedType) ? 'Local' : (/^overseas$/i.test(requestedType) ? 'Overseas' : '');
  const region = String(data.region || '').trim();
  const province = String(data.province || '').trim();
  const city = String(data.city || '').trim();
  const overseasLocation = String(data.overseasLocation || '').trim();
  const mobile = String(data.mobile || '').trim();
  const heesayProfileLink = String(data.heesayProfileLink || '').trim();
  const otpIdentity = otpMethod === 'telegram' ? tgUsername : emailAddress;

  if (!tgUsername) {
    throw new Error('TG Username is required.');
  }
  if (!firstName || !lastName || !heesayName || !heesayId || !locationType || !heesayProfileLink) {
    throw new Error('Please complete all required registration fields.');
  }
  if (otpMethod === 'email' && !emailAddress) {
    throw new Error('Email Address is required when Email OTP is selected.');
  }
  if (locationType === 'Local' && (!region || !province || !city)) {
    throw new Error('Please select your Region, Province, and City.');
  }
  if (locationType === 'Overseas' && !overseasLocation) {
    throw new Error('Please enter your overseas location.');
  }

  if (emailAddress) validateEmail_(emailAddress, 'Email Address');
  validateTelegramUsername_(tgUsername, 'TG Username');
  validateHeesayProfileLink_(heesayProfileLink);
  if (mobile && !/^09\d{9}$/.test(mobile)) {
    throw new Error('Mobile Number must be 11 digits and start with 09 when provided.');
  }
  if (emailAddress) ensureFormAEmailAvailable_(emailAddress);
  ensureIkonixTelegramAvailable_(tgUsername);
  assertIkonixRegistrationAvailable_('', heesayProfileLink);
  assertRegistrationOtpAlreadyVerified_(otpMethod, otpIdentity);

  const sh = getFormSheet_(FORM_A);
  const lock = LockService.getScriptLock();
  let photoFile = null;
  lock.waitLock(30000);
  try {
    if (emailAddress) ensureFormAEmailAvailable_(emailAddress);
    ensureIkonixTelegramAvailable_(tgUsername);
    assertIkonixRegistrationAvailable_(emailAddress, heesayProfileLink);
    photoFile = createIkonixRegistrationPhoto_(data.photo, heesayId);
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d/yyyy HH:mm:ss');
    sh.appendRow([
      timestamp,
      emailAddress,
      firstName,
      middleInitial,
      lastName,
      tgUsername,
      heesayName,
      heesayId,
      locationType,
      locationType === 'Local' ? region : '',
      locationType === 'Local' ? province : '',
      locationType === 'Local' ? city : '',
      locationType === 'Overseas' ? overseasLocation : '',
      mobile,
      heesayProfileLink,
      photoFile ? photoFile.getUrl() : '',
      '',
      'Pending'
    ]);
    const applicationRow = sh.getLastRow();
    upsertIkonixWorkflowRecord_(applicationRow, { stage: 'Pending' }, '');
    clearRegistrationOtpVerified_(otpMethod, otpIdentity);
    return { ok: true, status: 'Pending', message: 'Registration submitted successfully. Your application status is now Pending.' };
  } catch (err) {
    if (photoFile) {
      try { photoFile.setTrashed(true); } catch (cleanupErr) {}
    }
    throw err;
  } finally {
    lock.releaseLock();
  }
}

function isPortalOwnerAccount_(account) {
  return normalizeTelegramUsername_(account && account.telegramUsername) === PORTAL_OWNER_TG_ACCOUNT &&
    normalizeAdminRole_(account && account.role) === 'Portal Owner';
}

function canPostAnnouncements_(account) {
  const username = normalizeTelegramUsername_(account && account.telegramUsername);
  const role = normalizeAdminRole_(account && account.role);
  return username !== PORTAL_OWNER_TG_ACCOUNT && role === 'Portal Owner';
}

function getTelegramGroupsSheet_() {
  const ss = openSpreadsheet_(FORM_ID);
  let sh = ss.getSheetByName(TELEGRAM_GROUPS_SHEET);
  if (!sh) sh = ss.insertSheet(TELEGRAM_GROUPS_SHEET);
  const headerRange = sh.getRange(1, 1, 1, TELEGRAM_GROUPS_HEADERS.length);
  const currentHeaders = headerRange.getDisplayValues()[0];
  if (currentHeaders.join('|') !== TELEGRAM_GROUPS_HEADERS.join('|')) {
    headerRange.setValues([TELEGRAM_GROUPS_HEADERS]);
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('@');
  }
  return sh;
}

function getAnnouncementsSheet_() {
  const ss = openSpreadsheet_(FORM_ID);
  let sh = ss.getSheetByName(ANNOUNCEMENTS_SHEET);
  if (!sh) sh = ss.insertSheet(ANNOUNCEMENTS_SHEET);
  const headerRange = sh.getRange(1, 1, 1, ANNOUNCEMENT_HEADERS.length);
  const currentHeaders = headerRange.getDisplayValues()[0];
  if (currentHeaders.join('|') !== ANNOUNCEMENT_HEADERS.join('|')) {
    headerRange.setValues([ANNOUNCEMENT_HEADERS]);
    sh.setFrozenRows(1);
  }
  return sh;
}


function getPortalLibrarySheet_() {
  const ss = openSpreadsheet_(FORM_ID);
  let sh = ss.getSheetByName(PORTAL_LIBRARY_SHEET);
  if (!sh) sh = ss.insertSheet(PORTAL_LIBRARY_SHEET);
  const headerRange = sh.getRange(1, 1, 1, PORTAL_LIBRARY_HEADERS.length);
  const currentHeaders = headerRange.getDisplayValues()[0];
  if (currentHeaders.join('|') !== PORTAL_LIBRARY_HEADERS.join('|')) {
    headerRange.setValues([PORTAL_LIBRARY_HEADERS]);
    sh.setFrozenRows(1);
    sh.getRange('A:N').setNumberFormat('@');
  }
  return sh;
}

function getPortalLibraryFolder_() {
  return DriveApp.getFolderById(PORTAL_LIBRARY_FOLDER_ID);
}

function getPortalLibraryMediaKind_(mimeType) {
  const type = String(mimeType || '').toLowerCase();
  if (type.indexOf('image/') === 0) return 'image';
  if (type.indexOf('audio/') === 0) return 'audio';
  if (type.indexOf('video/') === 0) return 'video';
  if (type === 'application/pdf') return 'pdf';
  return 'file';
}

function getPortalLibraryDirectUrl_(fileId) {
  const id = String(fileId || '').trim();
  if (id && typeof DriveApp.getPublicUrl === 'function') {
    const publicUrl = DriveApp.getPublicUrl(id);
    if (publicUrl) return publicUrl;
  }
  return id ? 'https://drive.usercontent.google.com/download?id=' + encodeURIComponent(id) + '&export=download&confirm=t' : '';
}

function getPortalLibraryFallbackUrl_(fileId) {
  const id = String(fileId || '').trim();
  if (id && typeof DriveApp.getPublicUrl === 'function') {
    const publicUrl = DriveApp.getPublicUrl(id);
    if (publicUrl) return publicUrl;
  }
  return id ? 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(id) : '';
}

function formatPortalLibraryFileSize_(sizeBytes) {
  const size = Math.max(0, Number(sizeBytes || 0));
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(size >= 10 * 1024 * 1024 ? 0 : 1) + ' MB';
  if (size >= 1024) return (size / 1024).toFixed(size >= 10 * 1024 ? 0 : 1) + ' KB';
  return size + ' B';
}

function getPortalLibraryFiles_() {
  const sh = getPortalLibrarySheet_();
  if (sh.getLastRow() < 2) return [];
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, PORTAL_LIBRARY_HEADERS.length).getDisplayValues();
  return rows.map(function (row) {
    const fileId = String(row[3] || '');
    const sizeBytes = Number(row[7] || 0);
    return {
      id: String(row[0] || ''),
      fileName: String(row[1] || ''),
      mimeType: String(row[2] || 'application/octet-stream'),
      mediaKind: getPortalLibraryMediaKind_(row[2]),
      fileId: fileId,
      driveUrl: String(row[4] || ''),
      previewUrl: String((typeof DriveApp.getPublicUrl === 'function' && DriveApp.getPublicUrl(fileId)) || row[5] || (fileId ? 'https://drive.google.com/file/d/' + encodeURIComponent(fileId) + '/preview' : '')),
      directUrl: getPortalLibraryDirectUrl_(fileId),
      fallbackUrl: getPortalLibraryFallbackUrl_(fileId),
      imageUrl: fileId ? ((typeof DriveApp.getPublicUrl === 'function' && DriveApp.getPublicUrl(fileId)) || ('https://drive.google.com/thumbnail?id=' + encodeURIComponent(fileId) + '&sz=w2000')) : '',
      sizeBytes: sizeBytes,
      sizeLabel: formatPortalLibraryFileSize_(sizeBytes),
      status: String(row[8] || 'Active'),
      uploadedAt: String(row[9] || ''),
      updatedAt: String(row[10] || row[9] || ''),
      uploadedBy: normalizeTelegramUsername_(row[11]),
      archivedAt: String(row[12] || ''),
      archivedBy: normalizeTelegramUsername_(row[13])
    };
  }).filter(function (item) {
    return item.id && item.fileId && normalize_(item.status) !== 'archived';
  }).reverse().slice(0, 300);
}

function sanitizePortalLibraryFileName_(value) {
  const raw = String(value || '').trim();
  let name = '';
  for (let i = 0; i < raw.length; i += 1) {
    const character = raw.charAt(i);
    const code = raw.charCodeAt(i);
    name += code < 32 || code === 92 || '/:*?"<>|'.indexOf(character) >= 0 ? '_' : character;
  }
  if (!name) throw new Error('Choose a media file to upload.');
  return name.slice(0, 180);
}

function uploadPortalLibraryFile(token, fileData) {
  const session = assertAdminSession_(token);
  const source = fileData || {};
  const fileName = sanitizePortalLibraryFileName_(source.name);
  let mimeType = String(source.mimeType || 'application/octet-stream').split(';')[0].trim().toLowerCase();
  if (!mimeType || mimeType.indexOf('/') < 1) mimeType = 'application/octet-stream';
  const encoded = String(source.data || '');
  const base64 = encoded.indexOf(',') >= 0 ? encoded.slice(encoded.indexOf(',') + 1) : encoded;
  let bytes;
  try {
    bytes = Utilities.base64Decode(base64);
  } catch (decodeErr) {
    throw new Error('The selected file could not be read. Choose the file again.');
  }
  if (!bytes.length) throw new Error('The selected file is empty.');
  if (bytes.length > PORTAL_LIBRARY_MAX_BYTES) throw new Error('Library files must be 20 MB or smaller.');

  const libraryId = Utilities.getUuid();
  const timestamp = getIkonixPortalTimestamp_();
  const folder = getPortalLibraryFolder_();
  let file = null;
  try {
    file = folder.createFile(Utilities.newBlob(bytes, mimeType, fileName));
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (sharingErr) {
      console.error('Library file sharing warning: ' + String(sharingErr && sharingErr.message ? sharingErr.message : sharingErr));
    }
    const fileId = file.getId();
    const driveUrl = file.getUrl();
    const previewUrl = (typeof DriveApp.getPublicUrl === 'function' && DriveApp.getPublicUrl(fileId)) ||
      ('https://drive.google.com/file/d/' + encodeURIComponent(fileId) + '/preview');
    const directUrl = getPortalLibraryDirectUrl_(fileId);
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const sh = getPortalLibrarySheet_();
      sh.getRange(sh.getLastRow() + 1, 1, 1, PORTAL_LIBRARY_HEADERS.length)
        .setNumberFormat('@')
        .setValues([[
          libraryId,
          fileName,
          mimeType,
          fileId,
          driveUrl,
          previewUrl,
          directUrl,
          String(bytes.length),
          'Active',
          timestamp,
          timestamp,
          session.account.telegramUsername,
          '',
          ''
        ]]);
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    if (file) {
      try { file.setTrashed(true); } catch (cleanupErr) {}
    }
    throw err;
  }
  return {
    ok: true,
    id: libraryId,
    message: fileName + ' was uploaded to the Library.'
  };
}

function getPortalLibraryAudioData(token, libraryId) {
  assertAdminSession_(token);
  const requestedId = String(libraryId || '').trim();
  if (!requestedId) throw new Error('Library audio file was not specified.');

  const sh = getPortalLibrarySheet_();
  if (sh.getLastRow() < 2) throw new Error('Library audio file was not found.');
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, PORTAL_LIBRARY_HEADERS.length).getValues();
  let row = null;
  for (let i = 0; i < rows.length; i += 1) {
    if (String(rows[i][0] || '').trim() === requestedId) {
      row = rows[i];
      break;
    }
  }
  if (!row || normalize_(row[8]) === 'archived') throw new Error('Library audio file is no longer available.');

  const fileId = String(row[3] || '').trim();
  const mimeType = String(row[2] || 'audio/mpeg').split(';')[0].trim().toLowerCase();
  if (!fileId || getPortalLibraryMediaKind_(mimeType) !== 'audio') throw new Error('The selected Library file is not playable audio.');

  const file = DriveApp.getFileById(fileId);
  const blob = file.getBlob();
  const bytes = blob.getBytes();
  if (!bytes.length) throw new Error('The selected audio file is empty.');
  if (bytes.length > PORTAL_LIBRARY_MAX_BYTES) throw new Error('The selected audio file is too large to play in the portal.');

  return {
    ok: true,
    id: requestedId,
    fileName: String(row[1] || file.getName() || 'audio'),
    mimeType: mimeType || blob.getContentType() || 'audio/mpeg',
    base64: Utilities.base64Encode(bytes)
  };
}

function archivePortalLibraryFile(token, libraryId) {
  const session = assertAdminSession_(token);
  if (normalizeAdminRole_(session.account && session.account.role) !== 'Portal Owner') {
    throw new Error('Only the Portal Owner can archive Library files.');
  }
  const id = String(libraryId || '').trim();
  if (!id) throw new Error('Library file not found.');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sh = getPortalLibrarySheet_();
    if (sh.getLastRow() < 2) throw new Error('Library file not found.');
    const rows = sh.getRange(2, 1, sh.getLastRow() - 1, PORTAL_LIBRARY_HEADERS.length).getDisplayValues();
    let targetRow = 0;
    for (let i = 0; i < rows.length; i += 1) {
      if (String(rows[i][0] || '') === id && normalize_(rows[i][8]) !== 'archived') {
        targetRow = i + 2;
        break;
      }
    }
    if (!targetRow) throw new Error('Library file not found or already archived.');
    const timestamp = getIkonixPortalTimestamp_();
    sh.getRange(targetRow, 9).setValue('Archived');
    sh.getRange(targetRow, 11).setValue(timestamp);
    sh.getRange(targetRow, 13).setValue(timestamp);
    sh.getRange(targetRow, 14).setValue(session.account.telegramUsername);
    return { ok: true, id: id, message: 'Library file archived and removed from the active portal list.' };
  } finally {
    lock.releaseLock();
  }
}

function formatAnnouncementTimestamp_(date, pattern) {
  return Utilities.formatDate(date || new Date(), Session.getScriptTimeZone(), pattern || 'M/d/yyyy HH:mm:ss');
}

function cleanTelegramGroupText_(value, maxLength) {
  return String(value == null ? '' : value).replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength || 255);
}

function getTelegramGroupChatFromUpdate_(update) {
  const source = update || {};
  const memberUpdate = source.my_chat_member || null;
  const message = source.message || source.edited_message || null;
  const chat = (memberUpdate && memberUpdate.chat) || (message && message.chat) || null;
  if (!chat || (String(chat.type || '') !== 'group' && String(chat.type || '') !== 'supergroup')) return null;
  const memberStatus = memberUpdate && memberUpdate.new_chat_member
    ? String(memberUpdate.new_chat_member.status || '').toLowerCase()
    : '';
  const active = memberStatus !== 'left' && memberStatus !== 'kicked';
  return {
    chatId: String(chat.id || ''),
    title: cleanTelegramGroupText_(chat.title || chat.username || ('Group ' + chat.id), 255),
    type: String(chat.type || 'group'),
    username: cleanTelegramGroupText_(chat.username ? '@' + String(chat.username).replace(/^@/, '') : '', 64),
    status: active ? 'Active' : 'Inactive'
  };
}

function trackTelegramGroupFromUpdate_(update) {
  const group = getTelegramGroupChatFromUpdate_(update);
  if (!group || !group.chatId) return;
  const sh = getTelegramGroupsSheet_();
  const now = formatAnnouncementTimestamp_(new Date());
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const lastRow = sh.getLastRow();
    const rows = lastRow > 1
      ? sh.getRange(2, 1, lastRow - 1, TELEGRAM_GROUPS_HEADERS.length).getDisplayValues()
      : [];
    let rowNumber = 0;
    for (let i = 0; i < rows.length; i += 1) {
      if (String(rows[i][0] || '') === group.chatId) {
        rowNumber = i + 2;
        break;
      }
    }
    if (rowNumber) {
      sh.getRange(rowNumber, 1, 1, TELEGRAM_GROUPS_HEADERS.length)
        .setNumberFormat('@')
        .setValues([[
          group.chatId,
          group.title,
          group.type,
          group.username,
          sh.getRange(rowNumber, 5).getDisplayValue() || now,
          now,
          group.status
        ]]);
    } else {
      const targetRow = sh.getLastRow() + 1;
      sh.getRange(targetRow, 1, 1, TELEGRAM_GROUPS_HEADERS.length)
        .setNumberFormat('@')
        .setValues([[group.chatId, group.title, group.type, group.username, now, now, group.status]]);
    }
  } finally {
    lock.releaseLock();
  }
}

function getTelegramGroupsForPortal_() {
  const sh = getTelegramGroupsSheet_();
  if (sh.getLastRow() < 2) return [];
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, TELEGRAM_GROUPS_HEADERS.length).getDisplayValues();
  return rows.map(function (row) {
    return {
      chatId: String(row[0] || ''),
      title: String(row[1] || ''),
      type: String(row[2] || ''),
      username: String(row[3] || ''),
      firstSeenAt: String(row[4] || ''),
      lastSeenAt: String(row[5] || ''),
      status: String(row[6] || 'Active')
    };
  }).filter(function (group) {
    return group.chatId && normalize_(group.status) !== 'inactive';
  }).sort(function (a, b) {
    return String(a.title || '').localeCompare(String(b.title || ''));
  });
}

function sanitizeAnnouncementText_(value, fieldName, maxLength) {
  const text = String(value == null ? '' : value).replace(/\r\n?/g, '\n').trim();
  if (!text) throw new Error('Please enter the announcement ' + fieldName + '.');
  if (text.length > maxLength) {
    throw new Error('Announcement ' + fieldName + ' must contain no more than ' + maxLength + ' characters.');
  }
  return text;
}

function validateAnnouncementDates_(dates) {
  const unique = [];
  const seen = {};
  const today = formatAnnouncementTimestamp_(new Date(), 'yyyy-MM-dd');
  (Array.isArray(dates) ? dates : []).forEach(function (value) {
    const date = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Choose valid announcement dates.');
    if (date < today) throw new Error('Announcement dates cannot be in the past.');
    if (!seen[date]) {
      seen[date] = true;
      unique.push(date);
    }
  });
  if (!unique.length) throw new Error('Choose at least one announcement date.');
  if (unique.length > ANNOUNCEMENT_MAX_DATE_COUNT) {
    throw new Error('Choose no more than ' + ANNOUNCEMENT_MAX_DATE_COUNT + ' announcement dates.');
  }
  return unique.sort();
}

function validateAnnouncementTimes_(times) {
  const unique = [];
  const seen = {};
  (Array.isArray(times) ? times : []).forEach(function (value) {
    const time = String(value || '').trim();
    const match = /^(\d{2}):(\d{2})$/.exec(time);
    const hour = match ? Number(match[1]) : -1;
    const minute = match ? Number(match[2]) : -1;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error('Choose a valid announcement time.');
    }
    if (!seen[time]) {
      seen[time] = true;
      unique.push(time);
    }
  });
  if (!unique.length) throw new Error('Choose at least one announcement time.');
  return unique.sort();
}

function validateAnnouncementGroups_(chatIds) {
  const available = getTelegramGroupsForPortal_();
  const availableById = {};
  available.forEach(function (group) { availableById[group.chatId] = group; });
  const groups = [];
  const seen = {};
  (Array.isArray(chatIds) ? chatIds : []).forEach(function (value) {
    const chatId = String(value || '').trim();
    if (!chatId || seen[chatId]) return;
    if (!availableById[chatId]) throw new Error('One of the selected Telegram group chats is no longer available.');
    seen[chatId] = true;
    groups.push(availableById[chatId]);
  });
  if (!groups.length) throw new Error('Choose at least one Telegram group chat.');
  if (groups.length > ANNOUNCEMENT_MAX_GROUP_COUNT) {
    throw new Error('Choose no more than ' + ANNOUNCEMENT_MAX_GROUP_COUNT + ' Telegram group chats.');
  }
  return groups;
}

function createAnnouncementPhoto_(photo, announcementId) {
  if (!photo || !photo.data) return null;
  const mimeType = String(photo.mimeType || '').toLowerCase();
  const allowedTypes = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
  if (!allowedTypes[mimeType]) throw new Error('Photo must be a JPG, PNG, or WEBP image.');
  const bytes = Utilities.base64Decode(String(photo.data || '').replace(/^data:image\/[a-z0-9.+-]+;base64,/i, ''));
  if (!bytes.length) throw new Error('The selected announcement photo is empty.');
  if (bytes.length > IKONIX_MAX_PHOTO_BYTES) throw new Error('Photo must be 5 MB or smaller.');
  const fileName = 'IKONIX_ANNOUNCEMENT_' + String(announcementId || Utilities.getUuid()).replace(/[^A-Za-z0-9_-]/g, '') +
    '_' + formatAnnouncementTimestamp_(new Date(), 'yyyyMMdd_HHmmss') + allowedTypes[mimeType];
  return DriveApp.getFolderById(IKONIX_PHOTO_FOLDER_ID)
    .createFile(Utilities.newBlob(bytes, mimeType, fileName));
}

function ensureAnnouncementTrigger_() {
  const exists = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === ANNOUNCEMENT_TRIGGER_FUNCTION;
  });
  if (!exists) {
    ScriptApp.newTrigger(ANNOUNCEMENT_TRIGGER_FUNCTION).timeBased().everyMinutes(1).create();
  }
}

function getScheduledAnnouncementsForPortal_() {
  const sh = getAnnouncementsSheet_();
  if (sh.getLastRow() < 2) return [];
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, ANNOUNCEMENT_HEADERS.length).getDisplayValues();
  return rows.map(function (row, index) {
    return {
      rowNumber: index + 2,
      id: String(row[0] || ''),
      createdAt: String(row[1] || ''),
      createdBy: String(row[2] || ''),
      title: String(row[3] || ''),
      body: String(row[4] || ''),
      photoName: String(row[6] || ''),
      scheduledDate: String(row[7] || ''),
      scheduledTime: String(row[8] || ''),
      timeZone: String(row[9] || ''),
      chatId: String(row[10] || ''),
      chatTitle: String(row[11] || ''),
      status: String(row[12] || 'Pending'),
      postedAt: String(row[13] || ''),
      telegramMessageIds: String(row[14] || ''),
      error: String(row[15] || '')
    };
  }).reverse().slice(0, 200);
}

function refreshTelegramAnnouncementGroups(token) {
  const session = assertAdminSession_(token);
  if (!canPostAnnouncements_(session.account)) {
    throw new Error('Post Announcement is available only to an authorized Portal Owner.');
  }
  setTelegramBotWebhook_(getTelegramWebhookUrl_());
  const bot = getTelegramBotIdentity_();
  return {
    ok: true,
    botUsername: '@' + String(bot.username || ''),
    groups: getTelegramGroupsForPortal_(),
    timeZone: Session.getScriptTimeZone(),
    message: 'Group chats refreshed. Existing groups appear after /ikonixsync@IkonixREG_bot is sent in each group.'
  };
}

function createScheduledAnnouncement(token, data) {
  const session = assertAdminSession_(token);
  if (!canPostAnnouncements_(session.account)) {
    throw new Error('Post Announcement is available only to an authorized Portal Owner.');
  }
  const source = data || {};
  const title = sanitizeAnnouncementText_(source.title, 'title', ANNOUNCEMENT_MAX_TITLE_LENGTH);
  const body = sanitizeAnnouncementText_(source.body, 'body', ANNOUNCEMENT_MAX_BODY_LENGTH);
  const dates = validateAnnouncementDates_(source.dates);
  const times = validateAnnouncementTimes_(source.times);
  const groups = validateAnnouncementGroups_(source.chatIds);
  const dispatchCount = dates.length * times.length * groups.length;
  if (dispatchCount > ANNOUNCEMENT_MAX_DISPATCH_COUNT) {
    throw new Error('This creates ' + dispatchCount + ' posts. Reduce the dates, times, or group chats to ' + ANNOUNCEMENT_MAX_DISPATCH_COUNT + ' posts or fewer.');
  }

  const announcementId = Utilities.getUuid();
  const photoFile = createAnnouncementPhoto_(source.photo, announcementId);
  const createdAt = formatAnnouncementTimestamp_(new Date());
  const timeZone = Session.getScriptTimeZone();
  const rows = [];
  dates.forEach(function (date) {
    times.forEach(function (time) {
      groups.forEach(function (group) {
        rows.push([
          announcementId,
          createdAt,
          session.account.telegramUsername,
          title,
          body,
          photoFile ? photoFile.getId() : '',
          photoFile ? photoFile.getName() : '',
          date,
          time,
          timeZone,
          group.chatId,
          group.title,
          'Pending',
          '',
          '',
          ''
        ]);
      });
    });
  });

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sh = getAnnouncementsSheet_();
    const startRow = sh.getLastRow() + 1;
    sh.getRange(startRow, 1, rows.length, ANNOUNCEMENT_HEADERS.length)
      .setNumberFormat('@')
      .setValues(rows);
    ensureAnnouncementTrigger_();
    setTelegramBotWebhook_(getTelegramWebhookUrl_());
  } finally {
    lock.releaseLock();
  }
  return {
    ok: true,
    announcementId: announcementId,
    dispatchCount: dispatchCount,
    message: 'Announcement scheduled for ' + dispatchCount + ' Telegram post' + (dispatchCount === 1 ? '' : 's') + '.'
  };
}

function callTelegramBotApiMultipart_(method, payload) {
  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + getTelegramBotToken_() + '/' + method, {
    method: 'post',
    payload: payload || {},
    muteHttpExceptions: true
  });
  const responseCode = response.getResponseCode();
  let result;
  try {
    result = JSON.parse(response.getContentText() || '{}');
  } catch (err) {
    result = {};
  }
  if (responseCode < 200 || responseCode >= 300 || !result.ok) {
    throw new Error(String(result.description || 'Telegram Bot API request failed.'));
  }
  return result.result;
}

function sendScheduledAnnouncement_(row) {
  const messageText = 'Title: ' + String(row[3] || '') + '\n' +
    String(row[4] || '') + '\n\nfrom: ' + String(row[2] || '');
  const chatId = String(row[10] || '');
  const sentMessage = callTelegramBotApi_('sendMessage', {
    chat_id: chatId,
    text: messageText,
    protect_content: true
  });
  const messageIds = [String(sentMessage && sentMessage.message_id || '')].filter(String);
  const photoFileId = String(row[5] || '');
  if (photoFileId) {
    const photoFile = DriveApp.getFileById(photoFileId);
    const sentPhoto = callTelegramBotApiMultipart_('sendPhoto', {
      chat_id: chatId,
      photo: photoFile.getBlob(),
      protect_content: 'true'
    });
    if (sentPhoto && sentPhoto.message_id) messageIds.push(String(sentPhoto.message_id));
  }
  return messageIds;
}

function processScheduledAnnouncements() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    const sh = getAnnouncementsSheet_();
    if (sh.getLastRow() < 2) return;
    const values = sh.getRange(2, 1, sh.getLastRow() - 1, ANNOUNCEMENT_HEADERS.length).getDisplayValues();
    const nowKey = formatAnnouncementTimestamp_(new Date(), 'yyyy-MM-dd HH:mm');
    let processed = 0;
    for (let i = 0; i < values.length && processed < 25; i += 1) {
      const row = values[i];
      if (normalize_(row[12]) !== 'pending') continue;
      if ((String(row[7] || '') + ' ' + String(row[8] || '')) > nowKey) continue;
      const rowNumber = i + 2;
      sh.getRange(rowNumber, 13).setValue('Sending');
      SpreadsheetApp.flush();
      try {
        const messageIds = sendScheduledAnnouncement_(row);
        sh.getRange(rowNumber, 13, 1, 4).setValues([[
          'Posted',
          formatAnnouncementTimestamp_(new Date()),
          messageIds.join(', '),
          ''
        ]]);
      } catch (err) {
        sh.getRange(rowNumber, 13, 1, 4).setValues([[
          'Failed',
          '',
          '',
          String(err && err.message ? err.message : err).slice(0, 500)
        ]]);
      }
      processed += 1;
    }
  } finally {
    lock.releaseLock();
  }
}

function parseIkonixReportTimestamp_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) return value;
  const text = String(value || '').trim();
  if (!text) return null;
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(text);
  if (match) {
    const normalized = [
      match[3],
      ('0' + match[1]).slice(-2),
      ('0' + match[2]).slice(-2)
    ].join('-') + ' ' + [
      ('0' + (match[4] || '0')).slice(-2),
      match[5] || '00',
      match[6] || '00'
    ].join(':');
    try {
      return Utilities.parseDate(normalized, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    } catch (err) {}
  }
  const parsed = new Date(text);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function getIkonixWeeklyWindow_(now) {
  const current = now || new Date();
  const timeZone = Session.getScriptTimeZone();
  const isoDay = Number(Utilities.formatDate(current, timeZone, 'u')) || 1;
  const todayText = Utilities.formatDate(current, timeZone, 'yyyy-MM-dd');
  const todayStart = Utilities.parseDate(todayText + ' 00:00:00', timeZone, 'yyyy-MM-dd HH:mm:ss');
  const start = new Date(todayStart.getTime() - ((isoDay - 1) * 24 * 60 * 60 * 1000));
  const end = new Date(start.getTime() + (7 * 24 * 60 * 60 * 1000) - 1);
  return {
    start: start,
    end: end,
    asOf: current,
    label: Utilities.formatDate(start, timeZone, 'MMM d, yyyy') + ' - ' + Utilities.formatDate(end, timeZone, 'MMM d, yyyy'),
    timeZone: timeZone
  };
}

function getIkonixWeeklyReportData_() {
  const applications = getMemberApplicationsForPortal_();
  const window = getIkonixWeeklyWindow_(new Date());
  const stageOrder = ['Pending', 'Under Assessment', 'Orientation Scheduled', 'Commander Decision', 'Approved', 'Rejected', 'Exit'];
  const stageGroups = {};
  stageOrder.forEach(function (stage) { stageGroups[stage] = []; });
  let activeCount = 0;
  let exitCount = 0;

  applications.forEach(function (item) {
    const status = normalizeMemberWorkflowStatus_(item.status);
    // Lifetime portal totals: every non-Exit record is Active; Exit is Inactive.
    if (status === 'Exit') exitCount += 1;
    else activeCount += 1;
    const registeredAt = parseIkonixReportTimestamp_(item.timestamp);
    if (!registeredAt || registeredAt < window.start || registeredAt > window.asOf) return;
    if (!stageGroups[status]) stageGroups[status] = [];
    stageGroups[status].push(item);
  });

  return {
    window: window,
    stageOrder: stageOrder,
    stageGroups: stageGroups,
    activeCount: activeCount,
    exitCount: exitCount,
    weeklyRegistrationCount: Object.keys(stageGroups).reduce(function (total, stage) {
      return total + stageGroups[stage].length;
    }, 0)
  };
}

function getWeeklyReportMemberName_(item) {
  return [item.firstName, item.middleInitial, item.lastName].filter(String).join(' ') ||
    item.heesayName || item.tgUsername || item.heesayId || 'Member';
}

function buildIkonixWeeklyReportLines_(data) {
  const report = data || getIkonixWeeklyReportData_();
  const lines = [
    'IKONIX WEEKLY MEMBER REPORT',
    'Period: ' + report.window.label,
    'Generated: ' + Utilities.formatDate(report.window.asOf, report.window.timeZone, 'MMM d, yyyy h:mm a'),
    '',
    'ALL-TIME PORTAL TOTALS',
    'Current Active Members (all non-Exit): ' + report.activeCount,
    'Current Inactive Members (all Exit): ' + report.exitCount,
    '',
    'THIS WEEK',
    'Registrations: ' + report.weeklyRegistrationCount,
    '',
    'THIS WEEK - CURRENT STAGE SUMMARY'
  ];

  report.stageOrder.forEach(function (stage) {
    lines.push(stage + ': ' + (report.stageGroups[stage] || []).length);
  });

  lines.push('', 'REGISTRATIONS BY CURRENT STAGE');
  report.stageOrder.forEach(function (stage) {
    const items = report.stageGroups[stage] || [];
    lines.push('', stage.toUpperCase() + ' (' + items.length + ')');
    if (!items.length) {
      lines.push('- None');
      return;
    }
    items.forEach(function (item) {
      const detail = [
        getWeeklyReportMemberName_(item),
        item.tgUsername || 'No TG',
        item.heesayId ? 'Heesay ID ' + item.heesayId : 'No Heesay ID',
        'Registered ' + String(item.timestamp || '')
      ];
      if (stage === 'Exit' && item.exitEffectiveDate) detail.push('Effective ' + item.exitEffectiveDate);
      lines.push('- ' + detail.join(' | '));
    });
  });
  return lines;
}

function chunkTelegramReportLines_(lines, maxLength) {
  const limit = Number(maxLength || 3800);
  const messages = [];
  let current = '';
  (lines || []).forEach(function (line) {
    const text = String(line || '');
    if (current && current.length + text.length + 1 > limit) {
      messages.push(current);
      current = '';
    }
    current += (current ? '\n' : '') + text.slice(0, limit);
  });
  if (current) messages.push(current);
  return messages;
}

function sendIkonixWeeklyReport_() {
  const report = getIkonixWeeklyReportData_();
  const messages = chunkTelegramReportLines_(buildIkonixWeeklyReportLines_(report), 3800);
  const messageIds = [];
  messages.forEach(function (message) {
    const sent = callTelegramBotApi_('sendMessage', {
      chat_id: WEEKLY_REPORT_CHAT_ID,
      text: message,
      protect_content: true
    });
    if (sent && sent.message_id) messageIds.push(String(sent.message_id));
  });
  return {
    ok: true,
    chatId: WEEKLY_REPORT_CHAT_ID,
    messageCount: messages.length,
    messageIds: messageIds,
    activeCount: report.activeCount,
    exitCount: report.exitCount,
    weeklyRegistrationCount: report.weeklyRegistrationCount,
    period: report.window.label,
    message: 'Weekly report sent to Telegram group ' + WEEKLY_REPORT_CHAT_ID + '.'
  };
}

function sendIkonixWeeklyReport() {
  return sendIkonixWeeklyReport_();
}

function sendIkonixWeeklyReportNow(token) {
  const session = assertAdminSession_(token);
  if (normalizeAdminRole_(session.account && session.account.role) !== 'Portal Owner') {
    throw new Error('Weekly Report Send Now is available only to the Portal Owner.');
  }
  return sendIkonixWeeklyReport_();
}

function installIkonixWeeklyReportTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === WEEKLY_REPORT_TRIGGER_FUNCTION) ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger(WEEKLY_REPORT_TRIGGER_FUNCTION)
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(22)
    .create();
  return {
    ok: true,
    handler: WEEKLY_REPORT_TRIGGER_FUNCTION,
    timeZone: Session.getScriptTimeZone(),
    message: 'Weekly report trigger installed for Sunday at 10:00 PM.'
  };
}

// ================================
// IKONIX ADMIN PORTAL
// ================================

function getLoginSheet_() {
  const ss = openSpreadsheet_(FORM_ID);
  let sh = ss.getSheetByName(LOGIN_SHEET);
  if (!sh) sh = ss.insertSheet(LOGIN_SHEET);
  if (sh.getLastRow() < 1 || normalize_(sh.getRange(1, 1).getDisplayValue()) !== normalize_(LOGIN_HEADERS[0])) {
    sh.getRange(1, 1, 1, LOGIN_HEADERS.length).setValues([LOGIN_HEADERS]);
    sh.setFrozenRows(1);
  } else if (normalize_(sh.getRange(1, LOGIN_ROLE_COL).getDisplayValue()) !== 'role') {
    sh.getRange(1, LOGIN_ROLE_COL).setValue('Role');
  }
  return sh;
}

function getFeedbackSheet_() {
  const ss = openSpreadsheet_(FORM_ID);
  let sh = ss.getSheetByName(FEEDBACK_SHEET);
  if (!sh) sh = ss.insertSheet(FEEDBACK_SHEET);
  const headerRange = sh.getRange(1, 1, 1, FEEDBACK_HEADERS.length);
  const currentHeaders = headerRange.getDisplayValues()[0];
  if (currentHeaders.join('|') !== FEEDBACK_HEADERS.join('|')) {
    headerRange.setValues([FEEDBACK_HEADERS]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function sanitizeFeedbackField_(value, fieldName, maxLength, singleLine) {
  let text = String(value == null ? '' : value).replace(/\r\n?/g, '\n').trim();
  if (singleLine) text = text.replace(/\s+/g, ' ');
  if (!text) throw new Error('Please enter ' + fieldName + '.');
  if (text.length > maxLength) throw new Error(fieldName + ' must contain no more than ' + maxLength + ' characters.');
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function submitFeedbackForm(data) {
  const source = data || {};
  const name = sanitizeFeedbackField_(source.name, 'your name', 120, true);
  const feedback = sanitizeFeedbackField_(source.feedback, 'your feedback', 2000, false);
  const suggestion = sanitizeFeedbackField_(source.suggestion, 'your suggestion', 2000, false);
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d/yyyy HH:mm:ss');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    getFeedbackSheet_().appendRow([timestamp, name, feedback, suggestion]);
  } finally {
    lock.releaseLock();
  }
  return { ok: true, message: 'Thank you. Your feedback and suggestion were submitted.' };
}

function getFeedbackForPortal_() {
  const sh = getFeedbackSheet_();
  if (sh.getLastRow() < 2) return [];
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, FEEDBACK_HEADERS.length).getDisplayValues();
  return rows.map(function (row, index) {
    return {
      rowNumber: index + 2,
      submittedAt: String(row[0] || ''),
      name: String(row[1] || ''),
      feedback: String(row[2] || ''),
      suggestion: String(row[3] || '')
    };
  }).reverse();
}

function normalizeAdminStatus_(value) {
  const status = normalize_(value);
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  return 'Pending';
}

function normalizeAdminRole_(value) {
  const role = normalize_(value);
  if (role === 'portal owner' || role === 'owner') return 'Portal Owner';
  if (role === 'commander') return 'Commander';
  return 'Admin';
}

function canApproveMemberRegistration_(account) {
  const role = normalizeAdminRole_(account && account.role);
  return role === 'Portal Owner' || role === 'Commander';
}

function canViewAllMemberDetails_(account) {
  return canApproveMemberRegistration_(account);
}

function canViewFeedback_(account) {
  return normalizeAdminRole_(account && account.role) === 'Portal Owner';
}

function validateAdminPassword_(password) {
  const value = String(password == null ? '' : password);
  if (value.length < 8) throw new Error('Password must contain at least 8 characters.');
  if (value.length > 128) throw new Error('Password must contain no more than 128 characters.');
  return value;
}

function hashAdminPassword_(salt, password) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(salt || '') + ':' + String(password || ''),
    Utilities.Charset.UTF_8
  );
  return Utilities.base64EncodeWebSafe(bytes);
}

function getAdminAccountByTelegram_(telegramUsername) {
  const username = normalizeTelegramUsername_(telegramUsername);
  const sh = getLoginSheet_();
  if (!username || sh.getLastRow() < 2) return null;
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, LOGIN_HEADERS.length).getDisplayValues();
  for (let i = 0; i < rows.length; i += 1) {
    if (normalizeTelegramUsername_(rows[i][1]) === username) {
      return {
        rowNumber: i + 2,
        registeredAt: String(rows[i][0] || ''),
        telegramUsername: username,
        passwordSalt: String(rows[i][2] || ''),
        passwordHash: String(rows[i][3] || ''),
        status: normalizeAdminStatus_(rows[i][4]),
        approvedBy: String(rows[i][5] || ''),
        approvedAt: String(rows[i][6] || ''),
        lastLogin: String(rows[i][7] || ''),
        role: username === PORTAL_OWNER_TG_ACCOUNT ? 'Portal Owner' : normalizeAdminRole_(rows[i][8])
      };
    }
  }
  return null;
}

function getTelegramNotificationPropertyKey_(telegramUsername) {
  return IKONIX_NOTIFICATION_CHAT_PREFIX + getRegistrationIdentityHash_(normalizeTelegramUsername_(telegramUsername));
}

function saveTelegramNotificationChat_(telegramUsername, chatId) {
  const username = normalizeTelegramUsername_(telegramUsername);
  if (!username || !chatId) return;
  PropertiesService.getScriptProperties().setProperty(
    getTelegramNotificationPropertyKey_(username),
    JSON.stringify({ telegramUsername: username, chatId: String(chatId), updatedAt: new Date().getTime() })
  );
}

function getTelegramNotificationChatId_(telegramUsername) {
  const username = normalizeTelegramUsername_(telegramUsername);
  if (!username) return '';
  const key = getTelegramNotificationPropertyKey_(username);
  const raw = PropertiesService.getScriptProperties().getProperty(key);
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      if (saved && saved.chatId && normalizeTelegramUsername_(saved.telegramUsername) === username) {
        return String(saved.chatId);
      }
    } catch (err) {}
  }
  const transient = getTelegramChatMapping_(username);
  if (transient && transient.chatId) {
    saveTelegramNotificationChat_(username, transient.chatId);
    return String(transient.chatId);
  }
  return '';
}

function registerAdminAccount(telegramUsername, password) {
  const username = normalizeTelegramUsername_(telegramUsername);
  const safePassword = validateAdminPassword_(password);
  validateTelegramUsername_(username, 'TG Account');

  const sh = getLoginSheet_();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const existing = getAdminAccountByTelegram_(username);
    const salt = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    const passwordHash = hashAdminPassword_(salt, safePassword);
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d/yyyy HH:mm:ss');
    const transient = getTelegramChatMapping_(username);
    if (transient && transient.chatId) saveTelegramNotificationChat_(username, transient.chatId);

    if (existing && existing.status !== 'Rejected') {
      throw new Error(existing.status === 'Approved'
        ? 'This TG Account already has an approved admin account.'
        : 'This TG Account already has a pending admin registration.');
    }
    const newRow = [timestamp, username, salt, passwordHash, 'Pending', '', '', '', 'Admin'];
    if (existing) {
      sh.getRange(existing.rowNumber, 1, 1, LOGIN_HEADERS.length).setValues([newRow]);
    } else {
      sh.appendRow(newRow);
    }
    return {
      ok: true,
      status: 'Pending',
      role: 'Admin',
      message: 'Admin registration submitted. Your account will remain pending until an approved admin authorizes it.'
    };
  } finally {
    lock.releaseLock();
  }
}

function getAdminSessionCacheKey_(token) {
  return ADMIN_SESSION_CACHE_PREFIX + getRegistrationIdentityHash_(String(token || ''));
}

function getAdminPersistentSessionPropertyKey_(token) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(token || ''),
    Utilities.Charset.UTF_8
  );
  const hash = digest.map(function (byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
  return ADMIN_PERSISTENT_SESSION_PROPERTY_PREFIX + hash;
}

function removeAdminSession_(token) {
  const sessionToken = String(token || '').trim();
  if (!sessionToken) return;
  CacheService.getScriptCache().remove(getAdminSessionCacheKey_(sessionToken));
  PropertiesService.getScriptProperties().deleteProperty(getAdminPersistentSessionPropertyKey_(sessionToken));
}

function createAdminSession_(account, keepLoggedIn) {
  const token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  const persistent = keepLoggedIn === true;
  const ttlSeconds = persistent ? ADMIN_PERSISTENT_SESSION_TTL_SECONDS : ADMIN_SESSION_TTL_SECONDS;
  const now = new Date().getTime();
  const session = {
    telegramUsername: account.telegramUsername,
    rowNumber: account.rowNumber,
    createdAt: now,
    expiresAt: now + (ttlSeconds * 1000),
    persistent: persistent
  };
  const serialized = JSON.stringify(session);
  CacheService.getScriptCache().put(
    getAdminSessionCacheKey_(token),
    serialized,
    Math.min(ttlSeconds, ADMIN_SESSION_TTL_SECONDS)
  );
  if (persistent) {
    PropertiesService.getScriptProperties().setProperty(
      getAdminPersistentSessionPropertyKey_(token),
      serialized
    );
  }
  return { token: token, expiresInSeconds: ttlSeconds, persistent: persistent };
}

function assertAdminSession_(token) {
  const sessionToken = String(token || '').trim();
  if (!sessionToken) throw new Error('Your admin session has expired. Please log in again.');
  const cacheKey = getAdminSessionCacheKey_(sessionToken);
  const propertyKey = getAdminPersistentSessionPropertyKey_(sessionToken);
  const cache = CacheService.getScriptCache();
  const properties = PropertiesService.getScriptProperties();
  let raw = cache.get(cacheKey);
  let loadedFromPersistentStorage = false;
  if (!raw) {
    raw = properties.getProperty(propertyKey);
    loadedFromPersistentStorage = !!raw;
  }
  let session;
  if (!raw) throw new Error('Your admin session has expired. Please log in again.');
  try {
    session = JSON.parse(raw);
  } catch (err) {
    removeAdminSession_(sessionToken);
    throw new Error('Your admin session has expired. Please log in again.');
  }
  const now = new Date().getTime();
  const legacyExpiry = Number(session.createdAt || 0) + (ADMIN_SESSION_TTL_SECONDS * 1000);
  const expiresAt = Number(session.expiresAt || legacyExpiry);
  if (!expiresAt || expiresAt <= now) {
    removeAdminSession_(sessionToken);
    throw new Error('Your admin session has expired. Please log in again.');
  }
  if (loadedFromPersistentStorage) {
    const remainingSeconds = Math.max(1, Math.floor((expiresAt - now) / 1000));
    cache.put(cacheKey, raw, Math.min(remainingSeconds, ADMIN_SESSION_TTL_SECONDS));
  }
  const account = getAdminAccountByTelegram_(session.telegramUsername);
  if (!account || account.status !== 'Approved') {
    removeAdminSession_(sessionToken);
    throw new Error('This admin account is not approved.');
  }
  return { token: sessionToken, account: account, persistent: session.persistent === true, expiresAt: expiresAt };
}

function getAdminLoginRateKey_(telegramUsername) {
  return ADMIN_LOGIN_RATE_PREFIX + getRegistrationIdentityHash_(normalizeTelegramUsername_(telegramUsername));
}

function getAdminLoginAttemptCount_(telegramUsername) {
  return Number(CacheService.getScriptCache().get(getAdminLoginRateKey_(telegramUsername)) || 0);
}

function recordAdminLoginFailure_(telegramUsername) {
  const cache = CacheService.getScriptCache();
  const key = getAdminLoginRateKey_(telegramUsername);
  cache.put(key, String(getAdminLoginAttemptCount_(telegramUsername) + 1), ADMIN_LOGIN_RATE_SECONDS);
}

function loginAdmin(telegramUsername, password, keepLoggedIn) {
  const username = normalizeTelegramUsername_(telegramUsername);
  const suppliedPassword = String(password == null ? '' : password);
  validateTelegramUsername_(username, 'TG Account');
  if (!suppliedPassword) throw new Error('Please enter your password.');
  if (getAdminLoginAttemptCount_(username) >= ADMIN_LOGIN_MAX_ATTEMPTS) {
    throw new Error('Too many failed login attempts. Please try again in 10 minutes.');
  }

  const account = getAdminAccountByTelegram_(username);
  if (!account || !account.passwordSalt || hashAdminPassword_(account.passwordSalt, suppliedPassword) !== account.passwordHash) {
    recordAdminLoginFailure_(username);
    throw new Error('Invalid TG Account or password.');
  }
  if (account.status !== 'Approved') {
    throw new Error(account.status === 'Rejected'
      ? 'This admin registration was rejected.'
      : 'This admin account is still pending approval.');
  }

  CacheService.getScriptCache().remove(getAdminLoginRateKey_(username));
  const session = createAdminSession_(account, keepLoggedIn === true);
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d/yyyy HH:mm:ss');
  getLoginSheet_().getRange(account.rowNumber, 8).setValue(timestamp);
  return {
    ok: true,
    token: session.token,
    expiresInSeconds: session.expiresInSeconds,
    persistent: session.persistent,
    admin: {
      telegramUsername: account.telegramUsername,
      role: account.role,
      canApproveMembers: canApproveMemberRegistration_(account),
      canViewFullMemberDetails: canViewAllMemberDetails_(account)
    },
    message: 'Login successful.'
  };
}

function logoutAdmin(token) {
  removeAdminSession_(token);
  return { ok: true };
}

function getDriveFileIdFromUrl_(url) {
  const value = String(url || '').trim();
  const pathMatch = value.match(/\/d\/([A-Za-z0-9_-]+)/);
  const queryMatch = value.match(/[?&]id=([A-Za-z0-9_-]+)/);
  return pathMatch ? pathMatch[1] : (queryMatch ? queryMatch[1] : '');
}

function getPublicDriveImageUrl_(url) {
  const fileId = getDriveFileIdFromUrl_(url);
  return fileId ? 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(fileId) + '&sz=w1600' : String(url || '').trim();
}

function getIkonixWorkflowSheet_() {
  const ss = openSpreadsheet_(FORM_ID);
  let sh = ss.getSheetByName(IKONIX_WORKFLOW_SHEET);
  if (!sh) sh = ss.insertSheet(IKONIX_WORKFLOW_SHEET);
  const currentHeaders = sh.getLastColumn() ? sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), IKONIX_WORKFLOW_HEADERS.length)).getDisplayValues()[0] : [];
  const headersValid = IKONIX_WORKFLOW_HEADERS.every(function (header, index) {
    return String(currentHeaders[index] || '') === header;
  });
  if (!headersValid) {
    sh.getRange(1, 1, 1, IKONIX_WORKFLOW_HEADERS.length).setValues([IKONIX_WORKFLOW_HEADERS]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function getIkonixPortalTimestamp_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d/yyyy HH:mm:ss');
}

function normalizeMemberWorkflowStatus_(value) {
  const key = normalize_(value);
  if (key === 'approved' || key === 'active') return 'Approved';
  if (key === 'rejected') return 'Rejected';
  if (key === 'exit' || key === 'inactive' || key === 'removed') return 'Exit';
  if (key === 'under assessment' || key === 'assessment') return 'Under Assessment';
  if (key === 'orientation scheduled') return 'Orientation Scheduled';
  if (key === 'commander decision' || key === 'orientation completed' || key === 'orientation done') return 'Commander Decision';
  return 'Pending';
}

function getIkonixWorkflowMap_() {
  const sh = getIkonixWorkflowSheet_();
  const map = {};
  if (sh.getLastRow() < 2) return map;
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, IKONIX_WORKFLOW_HEADERS.length).getDisplayValues();
  rows.forEach(function (row, index) {
    const applicationRow = Number(row[0]);
    if (!applicationRow) return;
    map[String(applicationRow)] = {
      workflowRowNumber: index + 2,
      applicationRow: applicationRow,
      stage: normalizeMemberWorkflowStatus_(row[1]),
      assessmentStartedAt: String(row[2] || ''),
      orientationSchedule: String(row[3] || ''),
      orientationCompletedAt: String(row[4] || ''),
      decisionByTgUsername: normalizeTelegramUsername_(row[5]),
      decisionAt: String(row[6] || ''),
      notificationSummary: String(row[7] || ''),
      invitationStatus: String(row[8] || ''),
      invitationAt: String(row[9] || ''),
      updatedByTgUsername: normalizeTelegramUsername_(row[10]),
      updatedAt: String(row[11] || ''),
      orientationMethod: String(row[12] || ''),
      orientationVcrLink: String(row[13] || ''),
      reminderSentAt: String(row[14] || ''),
      exitEffectiveDate: String(row[15] || ''),
      exitByTgUsername: normalizeTelegramUsername_(row[16]),
      exitRecordedAt: String(row[17] || '')
    };
  });
  return map;
}

function upsertIkonixWorkflowRecord_(applicationRow, updates, updatedByTgUsername) {
  const sh = getIkonixWorkflowSheet_();
  const rowKey = Number(applicationRow);
  if (!Number.isInteger(rowKey) || rowKey < 2) throw new Error('Application row not found.');
  let targetRow = sh.getLastRow() + 1;
  let values = [rowKey, 'Pending', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  if (sh.getLastRow() >= 2) {
    const rows = sh.getRange(2, 1, sh.getLastRow() - 1, IKONIX_WORKFLOW_HEADERS.length).getDisplayValues();
    for (let i = 0; i < rows.length; i += 1) {
      if (Number(rows[i][0]) === rowKey) {
        targetRow = i + 2;
        values = rows[i].slice(0, IKONIX_WORKFLOW_HEADERS.length);
        break;
      }
    }
  }
  const source = updates || {};
  if (Object.prototype.hasOwnProperty.call(source, 'stage')) values[1] = normalizeMemberWorkflowStatus_(source.stage);
  if (Object.prototype.hasOwnProperty.call(source, 'assessmentStartedAt')) values[2] = String(source.assessmentStartedAt || '');
  if (Object.prototype.hasOwnProperty.call(source, 'orientationSchedule')) values[3] = String(source.orientationSchedule || '');
  if (Object.prototype.hasOwnProperty.call(source, 'orientationCompletedAt')) values[4] = String(source.orientationCompletedAt || '');
  if (Object.prototype.hasOwnProperty.call(source, 'decisionByTgUsername')) values[5] = normalizeTelegramUsername_(source.decisionByTgUsername);
  if (Object.prototype.hasOwnProperty.call(source, 'decisionAt')) values[6] = String(source.decisionAt || '');
  if (Object.prototype.hasOwnProperty.call(source, 'notificationSummary')) values[7] = String(source.notificationSummary || '');
  if (Object.prototype.hasOwnProperty.call(source, 'invitationStatus')) values[8] = String(source.invitationStatus || '');
  if (Object.prototype.hasOwnProperty.call(source, 'invitationAt')) values[9] = String(source.invitationAt || '');
  if (Object.prototype.hasOwnProperty.call(source, 'orientationMethod')) values[12] = String(source.orientationMethod || '');
  if (Object.prototype.hasOwnProperty.call(source, 'orientationVcrLink')) values[13] = String(source.orientationVcrLink || '');
  if (Object.prototype.hasOwnProperty.call(source, 'reminderSentAt')) values[14] = String(source.reminderSentAt || '');
  if (Object.prototype.hasOwnProperty.call(source, 'exitEffectiveDate')) values[15] = String(source.exitEffectiveDate || '');
  if (Object.prototype.hasOwnProperty.call(source, 'exitByTgUsername')) values[16] = normalizeTelegramUsername_(source.exitByTgUsername);
  if (Object.prototype.hasOwnProperty.call(source, 'exitRecordedAt')) values[17] = String(source.exitRecordedAt || '');
  values[10] = normalizeTelegramUsername_(updatedByTgUsername);
  values[11] = getIkonixPortalTimestamp_();
  sh.getRange(targetRow, 1, 1, IKONIX_WORKFLOW_HEADERS.length).setValues([values]);
  return values;
}

function getMemberApplicationsForPortal_() {
  const sh = getFormSheet_(FORM_A);
  if (sh.getLastRow() < 2) return [];
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, IKONIX_STATUS_COL).getDisplayValues();
  const workflowMap = getIkonixWorkflowMap_();
  return rows.map(function (row, index) {
    const applicationRow = index + 2;
    const workflow = workflowMap[String(applicationRow)] || {};
    const status = normalizeMemberWorkflowStatus_(row[17] || workflow.stage || 'Pending');
    return {
      rowNumber: applicationRow,
      timestamp: String(row[0] || ''),
      emailAddress: String(row[1] || ''),
      firstName: String(row[2] || ''),
      middleInitial: String(row[3] || ''),
      lastName: String(row[4] || ''),
      tgUsername: normalizeTelegramUsername_(row[5]),
      heesayName: String(row[6] || ''),
      heesayId: String(row[7] || ''),
      locationType: String(row[8] || ''),
      region: String(row[9] || ''),
      province: String(row[10] || ''),
      city: String(row[11] || ''),
      overseasLocation: String(row[12] || ''),
      mobile: String(row[13] || ''),
      heesayProfileLink: String(row[14] || ''),
      photoUrl: String(row[15] || ''),
      photoPreviewUrl: getPublicDriveImageUrl_(row[15]),
      approvedByTgUsername: normalizeTelegramUsername_(row[16]),
      status: status,
      assessmentStartedAt: String(workflow.assessmentStartedAt || ''),
      orientationSchedule: String(workflow.orientationSchedule || ''),
      orientationMethod: String(workflow.orientationMethod || ''),
      orientationVcrLink: String(workflow.orientationVcrLink || ''),
      reminderSentAt: String(workflow.reminderSentAt || ''),
      orientationCompletedAt: String(workflow.orientationCompletedAt || ''),
      decisionByTgUsername: normalizeTelegramUsername_(workflow.decisionByTgUsername || row[16]),
      decisionAt: String(workflow.decisionAt || ''),
      notificationSummary: String(workflow.notificationSummary || ''),
      invitationStatus: String(workflow.invitationStatus || ''),
      invitationAt: String(workflow.invitationAt || ''),
      updatedByTgUsername: normalizeTelegramUsername_(workflow.updatedByTgUsername),
      updatedAt: String(workflow.updatedAt || ''),
      exitEffectiveDate: String(workflow.exitEffectiveDate || ''),
      exitByTgUsername: normalizeTelegramUsername_(workflow.exitByTgUsername),
      exitRecordedAt: String(workflow.exitRecordedAt || '')
    };
  }).reverse();
}

function getAdminAccountsForPortal_() {
  const sh = getLoginSheet_();
  if (sh.getLastRow() < 2) return [];
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, LOGIN_HEADERS.length).getDisplayValues();
  return rows.map(function (row, index) {
    return {
      rowNumber: index + 2,
      registeredAt: String(row[0] || ''),
      telegramUsername: normalizeTelegramUsername_(row[1]),
      status: normalizeAdminStatus_(row[4]),
      approvedBy: String(row[5] || ''),
      approvedAt: String(row[6] || ''),
      lastLogin: String(row[7] || ''),
      role: normalizeTelegramUsername_(row[1]) === PORTAL_OWNER_TG_ACCOUNT ? 'Portal Owner' : normalizeAdminRole_(row[8])
    };
  }).reverse();
}

function getLimitedMemberApplication_(item) {
  return {
    rowNumber: item.rowNumber,
    tgUsername: item.tgUsername,
    heesayId: item.heesayId,
    heesayProfileLink: item.heesayProfileLink,
    photoUrl: item.photoUrl,
    photoPreviewUrl: item.photoPreviewUrl,
    status: item.status,
    assessmentStartedAt: item.assessmentStartedAt,
    orientationSchedule: item.orientationSchedule,
    orientationMethod: item.orientationMethod,
    orientationVcrLink: item.orientationVcrLink,
    reminderSentAt: item.reminderSentAt,
    orientationCompletedAt: item.orientationCompletedAt,
    decisionByTgUsername: item.decisionByTgUsername,
    decisionAt: item.decisionAt,
    notificationSummary: item.notificationSummary,
    invitationStatus: item.invitationStatus,
    invitationAt: item.invitationAt,
    updatedByTgUsername: item.updatedByTgUsername,
    updatedAt: item.updatedAt,
    exitEffectiveDate: item.exitEffectiveDate,
    exitByTgUsername: item.exitByTgUsername,
    exitRecordedAt: item.exitRecordedAt
  };
}

function getAdminPortalData(token) {
  const session = assertAdminSession_(token);
  try {
    advanceDueOrientationsToCommanderDecision_();
  } catch (automationErr) {
    console.error('Commander Decision automation error: ' + String(automationErr && automationErr.message ? automationErr.message : automationErr));
  }
  const allApplications = getMemberApplicationsForPortal_();
  const admins = getAdminAccountsForPortal_();
  const canViewFullDetails = canViewAllMemberDetails_(session.account);
  const canApproveMembers = canApproveMemberRegistration_(session.account);
  const canViewFeedback = canViewFeedback_(session.account);
  const feedback = canViewFeedback ? getFeedbackForPortal_() : [];
  const canPostAnnouncements = canPostAnnouncements_(session.account);
  const canSendWeeklyReport = normalizeAdminRole_(session.account && session.account.role) === 'Portal Owner';
  const canArchiveLibrary = normalizeAdminRole_(session.account && session.account.role) === 'Portal Owner';
  const libraryFiles = getPortalLibraryFiles_();
  const telegramGroups = canPostAnnouncements ? getTelegramGroupsForPortal_() : [];
  const scheduledAnnouncements = canPostAnnouncements ? getScheduledAnnouncementsForPortal_() : [];
  const applications = canViewFullDetails ? allApplications : allApplications.map(getLimitedMemberApplication_);
  const memberCounts = { total: allApplications.length, pending: 0, assessment: 0, orientation: 0, approved: 0, rejected: 0, exit: 0 };
  allApplications.forEach(function (item) {
    const status = normalizeMemberWorkflowStatus_(item.status);
    if (status === 'Approved') memberCounts.approved += 1;
    else if (status === 'Rejected') memberCounts.rejected += 1;
    else if (status === 'Exit') memberCounts.exit += 1;
    else if (status === 'Under Assessment') memberCounts.assessment += 1;
    else if (status === 'Orientation Scheduled' || status === 'Commander Decision') memberCounts.orientation += 1;
    else memberCounts.pending += 1;
  });
  return {
    ok: true,
    currentAdmin: {
      telegramUsername: session.account.telegramUsername,
      role: session.account.role,
      canApproveMembers: canApproveMembers,
      canViewFullMemberDetails: canViewFullDetails,
      canViewFeedback: canViewFeedback,
      canPostAnnouncements: canPostAnnouncements,
      canSendWeeklyReport: canSendWeeklyReport,
      canUploadLibrary: true,
      canArchiveLibrary: canArchiveLibrary
    },
    memberCounts: memberCounts,
    applications: applications,
    admins: admins,
    feedback: feedback,
    feedbackCount: feedback.length,
    libraryFiles: libraryFiles,
    telegramGroups: telegramGroups,
    scheduledAnnouncements: scheduledAnnouncements,
    announcementTimeZone: Session.getScriptTimeZone()
  };
}

function sendTelegramApprovalNotification_(telegramUsername, message) {
  const chatId = getTelegramNotificationChatId_(telegramUsername);
  if (!chatId) return { sent: false, channel: 'Telegram', message: 'No connected Telegram chat is available for notification.' };
  try {
    callTelegramBotApi_('sendMessage', { chat_id: chatId, text: String(message || ''), protect_content: true });
    return { sent: true, channel: 'Telegram', message: 'Telegram notification sent.' };
  } catch (err) {
    return { sent: false, channel: 'Telegram', message: 'Telegram notification could not be sent.' };
  }
}

function notifyMemberApproval_(application) {
  const fullName = [application.firstName, application.middleInitial, application.lastName].filter(String).join(' ');
  const message = [
    'IKONIX Starship Membership Approved',
    '',
    'Congratulations ' + (fullName || application.heesayName || 'Applicant') + '!',
    'The Commander has approved your IKONIX membership in the Portal.',
    '',
    'The Commander or one of the Admins will send your official Starships and Agency invitation to your Heesay account shortly. Welcome to Join  :)'
  ].join('\n');
  const results = [];

  if (application.emailAddress) {
    try {
      MailApp.sendEmail({ to: application.emailAddress, subject: 'IKONIX Starship Membership Approved', body: message });
      results.push({ sent: true, channel: 'Email', message: 'Approval email sent to the new member.' });
    } catch (err) {
      results.push({ sent: false, channel: 'Email', message: 'The member approval email could not be sent.' });
    }
  }

  if (application.tgUsername) {
    const telegramResult = sendTelegramApprovalNotification_(application.tgUsername, message);
    telegramResult.message = telegramResult.sent ? 'Telegram approval sent to the new member.' : telegramResult.message;
    results.push(telegramResult);
  }

  if (!results.length) return { sent: false, channel: '', message: 'No member notification destination is available.', results: [] };
  return {
    sent: results.some(function (item) { return item.sent; }),
    channel: results.map(function (item) { return item.channel; }).join(' + '),
    message: results.map(function (item) { return item.message; }).join(' '),
    results: results
  };
}

function notifyAdminsOfMemberDecision_(application, status, reviewerTelegramUsername) {
  const fullName = [application.firstName, application.middleInitial, application.lastName].filter(String).join(' ');
  const decision = normalizeMemberWorkflowStatus_(status);
  const message = [
    'IKONIX Membership Decision',
    '',
    'Applicant: ' + (fullName || application.heesayName || 'Applicant'),
    'Heesay ID: ' + (application.heesayId || 'Not provided'),
    'Decision: ' + decision,
    'Reviewed by: ' + (normalizeTelegramUsername_(reviewerTelegramUsername) || 'IKONIX Commander')
  ].join('\n');
  const approvedAdmins = getAdminAccountsForPortal_().filter(function (admin) {
    return normalizeAdminStatus_(admin.status) === 'Approved' && !!admin.telegramUsername;
  });
  const seen = {};
  const results = [];
  approvedAdmins.forEach(function (admin) {
    const username = normalizeTelegramUsername_(admin.telegramUsername);
    if (!username || seen[username]) return;
    seen[username] = true;
    const result = sendTelegramApprovalNotification_(username, message);
    result.recipient = username;
    results.push(result);
  });
  if (!results.length) return { sent: false, message: 'No approved admin Telegram destination is connected.', results: [] };
  return {
    sent: results.some(function (item) { return item.sent; }),
    message: results.filter(function (item) { return item.sent; }).length + ' admin notification(s) sent.',
    results: results
  };
}

function normalizeOrientationDate_(value) {
  const dateValue = String(value || '').trim();
  const match = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error('Please select a valid orientation date.');
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const testDate = new Date(year, month - 1, day);
  if (testDate.getFullYear() !== year || testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
    throw new Error('Please select a valid orientation date.');
  }
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  if (dateValue < today) throw new Error('The orientation date cannot be in the past.');
  return dateValue;
}

function formatOrientationDate_(value) {
  const dateValue = normalizeOrientationDate_(value);
  const parts = dateValue.split('-');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[Number(parts[1]) - 1] + ' ' + Number(parts[2]) + ', ' + parts[0];
}

function normalizeOrientationMethod_(value) {
  const key = normalize_(value);
  if (key === 'tg call' || key === 'telegram call') return 'TG Call';
  if (key === 'heesay vcr' || key === 'vcr') return 'Heesay VCR';
  throw new Error('Please select TG Call or Heesay VCR for the orientation method.');
}

function getStoredOrientationMethod_(value) {
  try { return normalizeOrientationMethod_(value); } catch (err) { return 'TG Call'; }
}

function normalizeOrientationVcrLink_(method, value) {
  if (method !== 'Heesay VCR') return '';
  const link = String(value || '').trim();
  if (!link) throw new Error('Please enter the Heesay VCR Link.');
  return validateHeesayLink_(link, 'Heesay VCR Link', '');
}

function sendOrientationTelegramAudience_(application, applicantMessage, restrictedStaffMessage, fullStaffMessage, contextLabel) {
  const results = [];
  if (application.tgUsername) {
    const applicantResult = sendTelegramApprovalNotification_(application.tgUsername, applicantMessage);
    applicantResult.recipient = application.tgUsername;
    applicantResult.recipientType = 'Applicant';
    applicantResult.message = applicantResult.sent ? contextLabel + ' sent to the applicant on Telegram.' : applicantResult.message;
    results.push(applicantResult);
  }
  const seen = {};
  const approvedPortalTeam = getAdminAccountsForPortal_().filter(function (admin) {
    const role = normalizeAdminRole_(admin.role);
    return normalizeAdminStatus_(admin.status) === 'Approved' && !!admin.telegramUsername &&
      (role === 'Admin' || role === 'Commander' || role === 'Portal Owner');
  });
  approvedPortalTeam.forEach(function (admin) {
    const username = normalizeTelegramUsername_(admin.telegramUsername);
    if (!username || seen[username]) return;
    seen[username] = true;
    const recipientRole = normalizeAdminRole_(admin.role);
    const result = sendTelegramApprovalNotification_(username, recipientRole === 'Admin' ? restrictedStaffMessage : fullStaffMessage);
    result.recipient = username;
    result.recipientType = recipientRole;
    results.push(result);
  });
  const sentCount = results.filter(function (item) { return item.sent; }).length;
  return {
    sent: sentCount > 0,
    message: sentCount + ' Telegram ' + contextLabel.toLowerCase() + '(s) sent to the applicant and portal team.',
    results: results
  };
}

function notifyOrientationSchedule_(application, orientationDate, orientationMethod, orientationVcrLink, scheduledByTelegramUsername) {
  const formattedDate = formatOrientationDate_(orientationDate);
  const method = getStoredOrientationMethod_(orientationMethod);
  const vcrLink = method === 'Heesay VCR' ? String(orientationVcrLink || '').trim() : '';
  const scheduledBy = normalizeTelegramUsername_(scheduledByTelegramUsername) || 'IKONIX Portal';
  const applicantName = [application.firstName, application.middleInitial, application.lastName].filter(String).join(' ') || application.heesayName || 'Applicant';
  const methodLines = ['Orientation Method: ' + method];
  if (vcrLink) methodLines.push('VCR Link: ' + vcrLink);
  const applicantInstruction = method === 'Heesay VCR'
    ? 'Please join the Heesay VCR using the link above on the scheduled date.'
    : 'Please be available on Telegram. The IKONIX team will contact you through a TG call.';
  const applicantMessage = [
    'IKONIX Orientation Schedule',
    '',
    'Hello ' + applicantName + ',',
    'Your IKONIX orientation is scheduled for ' + formattedDate + '.',
    ''
  ].concat(methodLines).concat([
    'TG Account: ' + (application.tgUsername || 'Not provided'),
    'Heesay ID: ' + (application.heesayId || 'Not provided'),
    'Scheduled by: ' + scheduledBy,
    '',
    applicantInstruction,
    'You will receive a Telegram reminder on the scheduled day.'
  ]).join('\n');
  const restrictedStaffMessage = [
    'IKONIX Orientation Scheduled',
    '',
    'Orientation Date: ' + formattedDate
  ].concat(methodLines).concat([
    'TG Account: ' + (application.tgUsername || 'Not provided'),
    'Heesay ID: ' + (application.heesayId || 'Not provided'),
    'Heesay Link: ' + (application.heesayProfileLink || 'Not provided'),
    'Scheduled by: ' + scheduledBy
  ]).join('\n');
  const fullStaffMessage = [
    'IKONIX Orientation Scheduled',
    '',
    'Orientation Date: ' + formattedDate
  ].concat(methodLines).concat([
    'Applicant: ' + applicantName,
    'TG Account: ' + (application.tgUsername || 'Not provided'),
    'Heesay ID: ' + (application.heesayId || 'Not provided'),
    'Heesay Link: ' + (application.heesayProfileLink || 'Not provided'),
    'Scheduled by: ' + scheduledBy
  ]).join('\n');
  return sendOrientationTelegramAudience_(application, applicantMessage, restrictedStaffMessage, fullStaffMessage, 'orientation notification');
}

function notifyOrientationReminder_(application, orientationDate, orientationMethod, orientationVcrLink) {
  const formattedDate = formatOrientationDate_(orientationDate);
  const method = getStoredOrientationMethod_(orientationMethod);
  const vcrLink = method === 'Heesay VCR' ? String(orientationVcrLink || '').trim() : '';
  const applicantName = [application.firstName, application.middleInitial, application.lastName].filter(String).join(' ') || application.heesayName || 'Applicant';
  const methodLines = ['Orientation Method: ' + method];
  if (vcrLink) methodLines.push('VCR Link: ' + vcrLink);
  const applicantInstruction = method === 'Heesay VCR'
    ? 'Please join the Heesay VCR using the link above today.'
    : 'Please stay available on Telegram for your TG call today.';
  const applicantMessage = [
    'IKONIX Orientation Reminder - Today',
    '',
    'Hello ' + applicantName + ',',
    'Your IKONIX orientation is scheduled today, ' + formattedDate + '.',
    ''
  ].concat(methodLines).concat(['', applicantInstruction]).join('\n');
  const restrictedStaffMessage = [
    'IKONIX Orientation Reminder - Today',
    '',
    'Orientation Date: ' + formattedDate
  ].concat(methodLines).concat([
    'TG Account: ' + (application.tgUsername || 'Not provided'),
    'Heesay ID: ' + (application.heesayId || 'Not provided')
  ]).join('\n');
  const fullStaffMessage = [
    'IKONIX Orientation Reminder - Today',
    '',
    'Orientation Date: ' + formattedDate
  ].concat(methodLines).concat([
    'Applicant: ' + applicantName,
    'TG Account: ' + (application.tgUsername || 'Not provided'),
    'Heesay ID: ' + (application.heesayId || 'Not provided'),
    'Heesay Link: ' + (application.heesayProfileLink || 'Not provided')
  ]).join('\n');
  return sendOrientationTelegramAudience_(application, applicantMessage, restrictedStaffMessage, fullStaffMessage, 'orientation reminder');
}

function ensureIkonixOrientationReminderTrigger_() {
  const handler = 'sendIkonixOrientationReminders';
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const exists = ScriptApp.getProjectTriggers().some(function (trigger) {
      return trigger.getHandlerFunction() === handler;
    });
    if (exists) return { ok: true, created: false, message: 'Orientation reminder and Commander Decision automation is active.' };
    ScriptApp.newTrigger(handler).timeBased().everyHours(1).create();
    return { ok: true, created: true, message: 'Orientation reminder and Commander Decision automation was activated.' };
  } finally {
    lock.releaseLock();
  }
}

function setupIkonixOrientationReminderTrigger() {
  return ensureIkonixOrientationReminderTrigger_();
}


function advanceDueOrientationsToCommanderDecision_() {
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    return { ok: false, checkedDate: today, moved: 0, rows: [], message: 'Another workflow update is active.' };
  }
  try {
    const workflowMap = getIkonixWorkflowMap_();
    const applicationSheet = getFormSheet_(FORM_A);
    const movedRows = [];
    const movedAt = getIkonixPortalTimestamp_();
    Object.keys(workflowMap).forEach(function (key) {
      const workflow = workflowMap[key];
      if (normalizeMemberWorkflowStatus_(workflow.stage) !== 'Orientation Scheduled') return;
      const schedule = String(workflow.orientationSchedule || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(schedule) || schedule >= today) return;
      const row = Number(workflow.applicationRow);
      if (!Number.isInteger(row) || row < 2 || row > applicationSheet.getLastRow()) return;
      applicationSheet.getRange(row, IKONIX_STATUS_COL).setValue('Commander Decision');
      upsertIkonixWorkflowRecord_(row, {
        stage: 'Commander Decision',
        orientationSchedule: schedule,
        orientationMethod: workflow.orientationMethod,
        orientationVcrLink: workflow.orientationVcrLink,
        reminderSentAt: workflow.reminderSentAt,
        orientationCompletedAt: workflow.orientationCompletedAt || movedAt,
        notificationSummary: [workflow.notificationSummary, 'Automatically moved to Commander Decision after the scheduled orientation date.'].filter(String).join(' ')
      }, '@IkonixREG_bot');
      movedRows.push(row);
    });
    if (movedRows.length) SpreadsheetApp.flush();
    return {
      ok: true,
      checkedDate: today,
      moved: movedRows.length,
      rows: movedRows,
      message: movedRows.length
        ? movedRows.length + ' application(s) moved to Commander Decision.'
        : 'No scheduled orientations are due for Commander Decision.'
    };
  } finally {
    lock.releaseLock();
  }
}

function sendIkonixOrientationReminders() {
  const advancement = advanceDueOrientationsToCommanderDecision_();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { ok: false, message: 'Another reminder run is already active.' };
  try {
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const workflowMap = getIkonixWorkflowMap_();
    const applicationSheet = getFormSheet_(FORM_A);
    const results = [];
    Object.keys(workflowMap).forEach(function (key) {
      const workflow = workflowMap[key];
      if (normalizeMemberWorkflowStatus_(workflow.stage) !== 'Orientation Scheduled') return;
      if (String(workflow.orientationSchedule || '') !== today || workflow.reminderSentAt) return;
      const row = Number(workflow.applicationRow);
      if (!Number.isInteger(row) || row < 2 || row > applicationSheet.getLastRow()) return;
      const application = getMemberApplicationFromRow_(applicationSheet, row);
      const reminder = notifyOrientationReminder_(application, workflow.orientationSchedule, workflow.orientationMethod, workflow.orientationVcrLink);
      if (reminder.sent) {
        const summary = [workflow.notificationSummary, reminder.message].filter(String).join(' ');
        upsertIkonixWorkflowRecord_(row, {
          stage: 'Orientation Scheduled',
          orientationSchedule: workflow.orientationSchedule,
          orientationMethod: workflow.orientationMethod,
          orientationVcrLink: workflow.orientationVcrLink,
          reminderSentAt: getIkonixPortalTimestamp_(),
          notificationSummary: summary
        }, '@IkonixREG_bot');
      }
      results.push({ rowNumber: row, sent: reminder.sent, message: reminder.message });
    });
    return {
      ok: true,
      checkedDate: today,
      movedToCommanderDecision: advancement && advancement.moved ? advancement.moved : 0,
      movedRows: advancement && advancement.rows ? advancement.rows : [],
      processed: results.length,
      sent: results.filter(function (item) { return item.sent; }).length,
      results: results
    };
  } finally {
    lock.releaseLock();
  }
}

function getMemberApplicationFromRow_(sheet, row) {
  const values = sheet.getRange(row, 1, 1, IKONIX_STATUS_COL).getDisplayValues()[0] || [];
  return {
    rowNumber: row,
    timestamp: String(values[0] || ''),
    emailAddress: String(values[1] || ''),
    firstName: String(values[2] || ''),
    middleInitial: String(values[3] || ''),
    lastName: String(values[4] || ''),
    tgUsername: normalizeTelegramUsername_(values[5]),
    heesayName: String(values[6] || ''),
    heesayId: String(values[7] || ''),
    heesayProfileLink: String(values[14] || ''),
    status: normalizeMemberWorkflowStatus_(values[17] || 'Pending')
  };
}

function advanceMemberApplicationWorkflow(token, rowNumber, requestedAction, data) {
  const session = assertAdminSession_(token);
  const action = normalize_(requestedAction);
  const request = data || {};
  const sh = getFormSheet_(FORM_A);
  const row = Number(rowNumber);
  if (!Number.isInteger(row) || row < 2 || row > sh.getLastRow()) throw new Error('Application row not found.');

  const lock = LockService.getScriptLock();
  let application;
  let nextStatus = '';
  let responseMessage = '';
  let decisionStatus = '';
  const updates = {};
  lock.waitLock(30000);
  try {
    application = getMemberApplicationFromRow_(sh, row);
    const currentStatus = normalizeMemberWorkflowStatus_(application.status);
    const existingWorkflow = getIkonixWorkflowMap_()[String(row)] || {};
    const now = getIkonixPortalTimestamp_();

    if (action === 'start_assessment') {
      if (currentStatus !== 'Pending') throw new Error('Only a Pending application can start assessment.');
      nextStatus = 'Under Assessment';
      updates.stage = nextStatus;
      updates.assessmentStartedAt = existingWorkflow.assessmentStartedAt || now;
      responseMessage = 'Assessment started. The application remains under review.';
    } else if (action === 'schedule_orientation') {
      if (currentStatus !== 'Under Assessment' && currentStatus !== 'Orientation Scheduled') {
        throw new Error('Orientation can only be scheduled after the assessment stage has started.');
      }
      const schedule = normalizeOrientationDate_(request.orientationSchedule);
      const orientationMethod = normalizeOrientationMethod_(request.orientationMethod);
      const orientationVcrLink = normalizeOrientationVcrLink_(orientationMethod, request.orientationVcrLink);
      nextStatus = 'Orientation Scheduled';
      updates.stage = nextStatus;
      updates.assessmentStartedAt = existingWorkflow.assessmentStartedAt || now;
      updates.orientationSchedule = schedule;
      updates.orientationMethod = orientationMethod;
      updates.orientationVcrLink = orientationVcrLink;
      updates.reminderSentAt = '';
      responseMessage = orientationMethod + ' orientation scheduled. Telegram notifications and the same-day reminder were prepared.';
    } else if (action === 'complete_orientation') {
      if (currentStatus !== 'Orientation Scheduled') throw new Error('Schedule the orientation before moving to Commander Decision.');
      nextStatus = 'Commander Decision';
      updates.stage = nextStatus;
      updates.orientationCompletedAt = now;
      responseMessage = 'Orientation completed. The application is now awaiting the Commander decision.';
    } else if (action === 'approve') {
      if (!canApproveMemberRegistration_(session.account)) {
        throw new Error('Only the Commander or Portal Owner can approve member registration.');
      }
      if (currentStatus !== 'Commander Decision') throw new Error('The Commander can approve membership only from the Commander Decision stage.');
      nextStatus = 'Approved';
      decisionStatus = nextStatus;
      updates.stage = nextStatus;
      updates.decisionByTgUsername = session.account.telegramUsername;
      updates.decisionAt = now;
      sh.getRange(row, IKONIX_APPROVED_BY_TG_COL).setValue(session.account.telegramUsername);
      responseMessage = 'Membership approved by the Commander. Admin and member notifications were processed.';
    } else if (action === 'reject') {
      if (currentStatus === 'Commander Decision' && !canApproveMemberRegistration_(session.account)) {
        throw new Error('Only the Commander or Portal Owner can record the Commander decision.');
      }
      if (currentStatus === 'Approved') throw new Error('An Approved membership cannot be rejected from this workflow.');
      if (currentStatus === 'Rejected') throw new Error('This application is already Rejected.');
      nextStatus = 'Rejected';
      decisionStatus = nextStatus;
      updates.stage = nextStatus;
      updates.decisionByTgUsername = session.account.telegramUsername;
      updates.decisionAt = now;
      sh.getRange(row, IKONIX_APPROVED_BY_TG_COL).setValue('');
      responseMessage = 'Application rejected. Admin notifications were processed; the applicant was not notified.';
    } else if (action === 'mark_invitations_sent') {
      if (currentStatus !== 'Approved') throw new Error('Starship and Agency invitations can only be issued after approval.');
      nextStatus = 'Approved';
      updates.stage = nextStatus;
      updates.invitationStatus = 'Starship and Agency Invitations Sent';
      updates.invitationAt = now;
      responseMessage = 'Starship and Agency invitations marked as sent.';
    } else if (action === 'remove_member') {
      if (!canApproveMemberRegistration_(session.account)) throw new Error('Only the Commander or Portal Owner can remove an active member.');
      if (currentStatus !== 'Approved') throw new Error('Only an Approved active member can be moved to Exit.');
      const exitEffectiveDate = String(request.exitEffectiveDate || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(exitEffectiveDate)) throw new Error('Choose the member exit effective date.');
      nextStatus = 'Exit';
      updates.stage = nextStatus;
      updates.exitEffectiveDate = exitEffectiveDate;
      updates.exitByTgUsername = session.account.telegramUsername;
      updates.exitRecordedAt = now;
      responseMessage = 'Member removed from Active status. Status is now Exit effective ' + exitEffectiveDate + '.';
    } else {
      throw new Error('Invalid workflow action.');
    }

    sh.getRange(row, IKONIX_STATUS_COL).setValue(nextStatus);
    upsertIkonixWorkflowRecord_(row, updates, session.account.telegramUsername);
    SpreadsheetApp.flush();
    application.status = nextStatus;
  } finally {
    lock.releaseLock();
  }

  let orientationNotification = { sent: false, message: 'No orientation notification required.', results: [] };
  let orientationReminderAutomation = { ok: false, created: false, message: 'No reminder automation required.' };
  let adminNotification = { sent: false, message: 'No decision notification required.', results: [] };
  let memberNotification = { sent: false, message: 'No member notification required.', results: [] };
  if (action === 'schedule_orientation') {
    orientationNotification = notifyOrientationSchedule_(application, updates.orientationSchedule, updates.orientationMethod, updates.orientationVcrLink, session.account.telegramUsername);
    try {
      orientationReminderAutomation = ensureIkonixOrientationReminderTrigger_();
    } catch (triggerErr) {
      orientationReminderAutomation = { ok: false, created: false, message: 'Same-day reminder automation could not be activated automatically.' };
    }
    upsertIkonixWorkflowRecord_(row, {
      stage: nextStatus,
      orientationSchedule: updates.orientationSchedule,
      orientationMethod: updates.orientationMethod,
      orientationVcrLink: updates.orientationVcrLink,
      reminderSentAt: '',
      notificationSummary: [orientationNotification.message, orientationReminderAutomation.message].filter(String).join(' ')
    }, session.account.telegramUsername);
  }
  if (decisionStatus) {
    adminNotification = notifyAdminsOfMemberDecision_(application, decisionStatus, session.account.telegramUsername);
    if (decisionStatus === 'Approved') memberNotification = notifyMemberApproval_(application);
    const summary = [adminNotification.message, memberNotification.message].filter(String).join(' ');
    upsertIkonixWorkflowRecord_(row, { stage: decisionStatus, notificationSummary: summary }, session.account.telegramUsername);
  }

  return {
    ok: true,
    status: nextStatus,
    approvedBy: nextStatus === 'Approved' ? session.account.telegramUsername : '',
    orientationNotification: orientationNotification,
    orientationReminderAutomation: orientationReminderAutomation,
    adminNotification: adminNotification,
    memberNotification: memberNotification,
    message: responseMessage
  };
}

function batchAdvanceMemberApplicationWorkflow(token, rowNumbers, requestedAction, data) {
  const session = assertAdminSession_(token);
  const action = normalize_(requestedAction);
  const allowedActions = ['start_assessment', 'schedule_orientation', 'complete_orientation', 'approve', 'reject', 'mark_invitations_sent'];
  if (allowedActions.indexOf(action) === -1) throw new Error('Invalid batch workflow action.');
  if (action === 'approve' && !canApproveMemberRegistration_(session.account)) {
    throw new Error('Only the Commander or Portal Owner can approve member registration.');
  }
  const rows = [];
  const seen = {};
  (Array.isArray(rowNumbers) ? rowNumbers : []).forEach(function (value) {
    const row = Number(value);
    if (!Number.isInteger(row) || row < 2 || seen[row]) return;
    seen[row] = true;
    rows.push(row);
  });
  if (!rows.length) throw new Error('Select at least one member application.');
  if (rows.length > 100) throw new Error('A batch can process up to 100 applications at a time.');
  const results = rows.map(function (row) {
    try {
      const result = advanceMemberApplicationWorkflow(token, row, action, data || {});
      return { rowNumber: row, ok: true, status: result.status, message: result.message };
    } catch (err) {
      return { rowNumber: row, ok: false, message: err && err.message ? err.message : String(err) };
    }
  });
  const succeeded = results.filter(function (item) { return item.ok; }).length;
  const failed = results.length - succeeded;
  return {
    ok: failed === 0,
    processed: results.length,
    succeeded: succeeded,
    failed: failed,
    results: results,
    message: succeeded + ' application(s) updated' + (failed ? '; ' + failed + ' could not be updated.' : '.')
  };
}

function updateMemberApplicationStatus(token, rowNumber, requestedStatus) {
  const status = normalizeMemberWorkflowStatus_(requestedStatus);
  if (status === 'Approved') return advanceMemberApplicationWorkflow(token, rowNumber, 'approve', {});
  if (status === 'Rejected') return advanceMemberApplicationWorkflow(token, rowNumber, 'reject', {});
  throw new Error('Use the membership workflow actions to update this application.');
}

function updateAdminAccountStatus(token, rowNumber, requestedStatus) {
  const session = assertAdminSession_(token);
  const status = normalizeAdminStatus_(requestedStatus);
  if (status !== 'Approved' && status !== 'Rejected') throw new Error('Invalid admin account status.');
  const sh = getLoginSheet_();
  const row = Number(rowNumber);
  if (!Number.isInteger(row) || row < 2 || row > sh.getLastRow()) throw new Error('Admin account row not found.');

  const values = sh.getRange(row, 1, 1, LOGIN_HEADERS.length).getDisplayValues()[0] || [];
  const targetUsername = normalizeTelegramUsername_(values[1]);
  if (targetUsername === session.account.telegramUsername && status !== 'Approved') {
    throw new Error('You cannot reject your own active admin account.');
  }
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'M/d/yyyy HH:mm:ss');
  sh.getRange(row, LOGIN_STATUS_COL).setValue(status);
  sh.getRange(row, 6).setValue(session.account.telegramUsername);
  sh.getRange(row, 7).setValue(timestamp);
  SpreadsheetApp.flush();

  let notification = { sent: false, channel: 'Telegram', message: 'No notification requested.' };
  if (status === 'Approved') {
    notification = sendTelegramApprovalNotification_(targetUsername, [
      'IKONIX Admin Account Approved',
      '',
      'Your IKONIX Portal admin registration has been approved.',
      'You may now log in using your TG Account and password.'
    ].join('\n'));
  }
  return {
    ok: true,
    status: status,
    notification: notification,
    message: 'Admin account marked ' + status + '.' + (notification.sent ? ' ' + notification.message : '')
  };
}

function diagnoseIkonixPortalSetup() {
  const loginSheet = getLoginSheet_();
  const registrationSheet = getFormSheet_(FORM_A);
  const loginHeaders = loginSheet.getRange(1, 1, 1, LOGIN_HEADERS.length).getDisplayValues()[0] || [];
  const admins = getAdminAccountsForPortal_();
  const summary = {
    loginSheet: loginSheet.getName(),
    registrationSheet: registrationSheet.getName(),
    loginHeadersValid: LOGIN_HEADERS.every(function (header, index) { return String(loginHeaders[index] || '') === header; }),
    adminAccountCount: admins.length,
    approvedAdminCount: admins.filter(function (item) { return item.status === 'Approved'; }).length,
    applicationCount: Math.max(0, registrationSheet.getLastRow() - 1)
  };
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

function getPsgcCacheKey_(path) {
  return 'psgc_' + Utilities.base64EncodeWebSafe(String(path || '')).slice(0, 90);
}

function getPsgcItems_(path) {
  const requestPath = String(path || '');
  const cache = CacheService.getScriptCache();
  const cacheKey = getPsgcCacheKey_(requestPath);
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const response = UrlFetchApp.fetch(PSGC_API_BASE_URL + requestPath, {
    method: 'get',
    muteHttpExceptions: true,
    followRedirects: true
  });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    throw new Error('Unable to load location list right now. Please try again.');
  }

  const parsed = JSON.parse(response.getContentText('UTF-8'));
  const list = Array.isArray(parsed) ? parsed : (parsed.data || parsed.value || []);
  const items = list.map(function (item) {
    return {
      name: cleanRegistrationLocationPart_(item.name || item.area_name),
      code: cleanRegistrationLocationPart_(item.code || item.psgc_code),
      type: cleanRegistrationLocationPart_(item.type || item.geographic_level)
    };
  }).filter(function (item) {
    return item.name && item.code;
  });

  cache.put(cacheKey, JSON.stringify(items), PSGC_LOCATION_CACHE_SECONDS);
  return items;
}

function getPsgcLookupKey_(value) {
  return normalize_(String(value || '').replace(/[()]/g, ' ').replace(/\s+/g, ' '));
}

function resolveRegistrationRegionCode_(regionCodeOrName) {
  const value = cleanRegistrationLocationPart_(regionCodeOrName);
  const key = getPsgcLookupKey_(value);
  if (/^\d{10}$/.test(value)) return value;
  return PSGC_REGION_CODES_BY_NAME[key] || value;
}

function resolveRegistrationProvinceCode_(regionCode, provinceCodeOrName) {
  const value = cleanRegistrationLocationPart_(provinceCodeOrName);
  const key = getPsgcLookupKey_(value);
  if (!value || value === PSGC_NCR_PROVINCE_CODE || /^\d{10}$/.test(value)) return value;
  if (regionCode === PSGC_NCR_REGION_CODE && (key === 'metro manila' || key === 'ncr')) return PSGC_NCR_PROVINCE_CODE;

  const provinces = getPsgcItems_('/regions/' + encodeURIComponent(regionCode) + '/provinces');
  for (let i = 0; i < provinces.length; i++) {
    if (getPsgcLookupKey_(provinces[i].name) === key) return provinces[i].code;
  }
  return value;
}

function getRegistrationRegions() {
  return getPsgcItems_('/regions').map(function (region) {
    return { name: region.name, code: region.code };
  });
}

function getRegistrationProvinces(regionCode) {
  const code = resolveRegistrationRegionCode_(regionCode);
  if (!code) return [];

  const provinces = getPsgcItems_('/regions/' + encodeURIComponent(code) + '/provinces').map(function (province) {
    return { name: province.name, code: province.code };
  });

  if (!provinces.length && code === PSGC_NCR_REGION_CODE) {
    return [{ name: PSGC_NCR_PROVINCE_NAME, code: PSGC_NCR_PROVINCE_CODE }];
  }

  return provinces;
}

function getRegistrationCities(regionCode, provinceCode) {
  const region = resolveRegistrationRegionCode_(regionCode);
  const province = resolveRegistrationProvinceCode_(region, provinceCode);
  const path = province === PSGC_NCR_PROVINCE_CODE
    ? '/regions/' + encodeURIComponent(region) + '/cities-municipalities'
    : '/provinces/' + encodeURIComponent(province) + '/cities-municipalities';

  if (!province || (province === PSGC_NCR_PROVINCE_CODE && !region)) return [];

  return getPsgcItems_(path)
    .filter(function (city) {
      const type = normalize_(city.type);
      return !type || type === 'city' || type === 'mun';
    })
    .map(function (city) {
      return { name: city.name, code: city.code };
    });
}

function getFacebookLinkGuideSlides() {
  const presentation = Slides.Presentations.get(FACEBOOK_LINK_GUIDE_PRESENTATION_ID, {
    fields: 'title,slides(objectId)'
  });
  const slides = (presentation.slides || []).map(function (slide, index) {
    const thumbnail = Slides.Presentations.Pages.getThumbnail(
      FACEBOOK_LINK_GUIDE_PRESENTATION_ID,
      slide.objectId,
      {
        'thumbnailProperties.mimeType': 'PNG',
        'thumbnailProperties.thumbnailSize': 'LARGE'
      }
    );
    return {
      index: index + 1,
      objectId: slide.objectId,
      imageUrl: thumbnail.contentUrl,
      width: thumbnail.width || '',
      height: thumbnail.height || ''
    };
  });

  return {
    ok: true,
    title: presentation.title || 'How to get your Facebook link',
    presentationUrl: FACEBOOK_LINK_GUIDE_PRESENTATION_URL,
    slides: slides
  };
}
