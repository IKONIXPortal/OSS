'use strict';

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_HEADERS = Object.freeze({
  Registration: ['Timestamp', 'Email Address', 'First Name', 'Middle Initial', 'Last Name', 'TG Username', 'Heesay Name', 'Heesay ID', 'Location Type', 'Region', 'Province', 'City', 'Overseas Location', 'Mobile Number', 'Heesay Profile Link', 'Photo URL', 'Approved By TG Username', 'Status'],
  Library: ['Library ID', 'File Name', 'MIME Type', 'Drive File ID', 'Drive URL', 'Preview URL', 'Direct URL', 'Size Bytes', 'Status', 'Uploaded At', 'Updated At', 'Uploaded By TG Username', 'Archived At', 'Archived By TG Username'],
  Announcements: ['Announcement ID', 'Created At', 'Created By TG', 'Title', 'Body', 'Photo File ID', 'Photo Name', 'Scheduled Date', 'Scheduled Time', 'Time Zone', 'Chat ID', 'Group Chat', 'Status', 'Posted At', 'Telegram Message IDs', 'Error'],
  'Telegram Groups': ['Chat ID', 'Group Chat', 'Type', 'Username', 'First Seen At', 'Last Seen At', 'Status'],
  Feedback: ['Submitted At', 'Name', 'Feedback', 'Suggestion'],
  Workflow: ['Application Row', 'Stage', 'Assessment Started At', 'Orientation Schedule', 'Orientation Completed At', 'Decision By TG Username', 'Decision At', 'Notification Summary', 'Invitation Status', 'Invitation At', 'Updated By TG Username', 'Updated At', 'Orientation Method', 'Orientation VCR Link', 'Reminder Sent At', 'Exit Effective Date', 'Exit By TG Username', 'Exit Recorded At'],
  Login: ['Registered At', 'TG Account', 'Password Salt', 'Password Hash', 'Status', 'Approved By', 'Approved At', 'Last Login', 'Role']
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isBlank(value) {
  return value === null || value === undefined || value === '';
}

function columnNumber(label) {
  return String(label || '').toUpperCase().split('').reduce((value, character) => {
    const digit = character.charCodeAt(0) - 64;
    return digit >= 1 && digit <= 26 ? (value * 26) + digit : value;
  }, 0);
}

function parseA1(a1, maxRows, maxColumns) {
  const value = String(a1 || '').trim().replace(/\$/g, '');
  const columnRange = /^([A-Za-z]+):([A-Za-z]+)$/.exec(value);
  if (columnRange) {
    const startColumn = columnNumber(columnRange[1]);
    const endColumn = columnNumber(columnRange[2]);
    return { row: 1, column: startColumn, rows: Math.max(1, maxRows), columns: endColumn - startColumn + 1 };
  }

  const cellRange = /^([A-Za-z]+)(\d+)(?::([A-Za-z]+)(\d+))?$/.exec(value);
  if (!cellRange) throw new Error(`Unsupported JSON workbook range: ${value}`);
  const startColumn = columnNumber(cellRange[1]);
  const startRow = Number(cellRange[2]);
  const endColumn = cellRange[3] ? columnNumber(cellRange[3]) : startColumn;
  const endRow = cellRange[4] ? Number(cellRange[4]) : startRow;
  return { row: startRow, column: startColumn, rows: endRow - startRow + 1, columns: endColumn - startColumn + 1 };
}

class JsonRange {
  constructor(sheet, row, column, rowCount, columnCount) {
    this.sheet = sheet;
    this.row = Number(row);
    this.column = Number(column);
    this.rowCount = Math.max(1, Number(rowCount || 1));
    this.columnCount = Math.max(1, Number(columnCount || 1));
  }

  getValues() {
    const output = [];
    for (let rowOffset = 0; rowOffset < this.rowCount; rowOffset += 1) {
      const source = this.sheet.rows[this.row - 1 + rowOffset] || [];
      const row = [];
      for (let columnOffset = 0; columnOffset < this.columnCount; columnOffset += 1) {
        const value = source[this.column - 1 + columnOffset];
        row.push(value === undefined ? '' : value);
      }
      output.push(row);
    }
    return clone(output);
  }

  getDisplayValues() {
    return this.getValues().map((row) => row.map((value) => {
      if (value === null || value === undefined) return '';
      if (value instanceof Date) return value.toISOString();
      return String(value);
    }));
  }

  getDisplayValue() {
    return this.getDisplayValues()[0][0];
  }

  setValue(value) {
    return this.setValues([[value]]);
  }

  setValues(values) {
    if (!Array.isArray(values) || values.length !== this.rowCount) {
      throw new Error('setValues row count does not match the target range.');
    }
    values.forEach((sourceRow) => {
      if (!Array.isArray(sourceRow) || sourceRow.length !== this.columnCount) {
        throw new Error('setValues column count does not match the target range.');
      }
    });
    this.sheet.ensureSize(this.row + this.rowCount - 1, this.column + this.columnCount - 1);
    values.forEach((sourceRow, rowOffset) => {
      sourceRow.forEach((value, columnOffset) => {
        this.sheet.rows[this.row - 1 + rowOffset][this.column - 1 + columnOffset] = value;
      });
    });
    this.sheet.markDirty();
    return this;
  }

  setNumberFormat() {
    return this;
  }

  getFormula() {
    const value = this.getValues()[0][0];
    return typeof value === 'string' && value.startsWith('=') ? value : '';
  }

  copyTo(destination) {
    destination.setValues(this.getValues());
    return destination;
  }
}

class JsonSheet {
  constructor(workbook, name, rows) {
    this.workbook = workbook;
    this.name = name;
    this.rows = rows && rows.length ? rows : [[]];
  }

  markDirty() {
    this.workbook.dirty.add(this.name);
  }

  ensureSize(rowCount, columnCount) {
    while (this.rows.length < rowCount) this.rows.push([]);
    this.rows.forEach((row) => {
      while (row.length < columnCount) row.push('');
    });
  }

  getLastRow() {
    for (let index = this.rows.length - 1; index >= 0; index -= 1) {
      if ((this.rows[index] || []).some((value) => !isBlank(value))) return index + 1;
    }
    return 0;
  }

  getLastColumn() {
    let lastColumn = 0;
    this.rows.forEach((row) => {
      for (let index = row.length - 1; index >= 0; index -= 1) {
        if (!isBlank(row[index])) {
          lastColumn = Math.max(lastColumn, index + 1);
          break;
        }
      }
    });
    return lastColumn;
  }

  getRange(rowOrA1, column, rowCount, columnCount) {
    if (typeof rowOrA1 === 'string') {
      const parsed = parseA1(rowOrA1, this.getLastRow(), this.getLastColumn());
      return new JsonRange(this, parsed.row, parsed.column, parsed.rows, parsed.columns);
    }
    return new JsonRange(this, rowOrA1, column, rowCount || 1, columnCount || 1);
  }

  appendRow(values) {
    const targetRow = Math.max(1, this.getLastRow() + 1);
    this.getRange(targetRow, 1, 1, values.length).setValues([values]);
    return this;
  }

  setFrozenRows() {
    return this;
  }

  getName() {
    return this.name;
  }
}

class JsonSpreadsheet {
  constructor(workbook) {
    this.workbook = workbook;
  }

  getSheetByName(name) {
    return this.workbook.getSheet(name);
  }

  insertSheet(name) {
    return this.workbook.insertSheet(name);
  }
}

class JsonWorkbook {
  constructor(dataDirectory) {
    this.dataDirectory = path.resolve(dataDirectory);
    this.sheets = new Map();
    this.dirty = new Set();
    this.loadAll();
  }

  filePath(name) {
    return path.join(this.dataDirectory, `${name}.json`);
  }

  recordsToRows(name, records) {
    const configured = DEFAULT_HEADERS[name] || [];
    const discovered = [];
    (records || []).forEach((record) => {
      Object.keys(record || {}).forEach((key) => {
        if (!configured.includes(key) && !discovered.includes(key)) discovered.push(key);
      });
    });
    const headers = configured.concat(discovered);
    return [headers].concat((records || []).map((record) => headers.map((header) => {
      const value = record && Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
      return value === null ? '' : value;
    })));
  }

  loadAll() {
    const names = new Set(Object.keys(DEFAULT_HEADERS));
    if (fs.existsSync(this.dataDirectory)) {
      fs.readdirSync(this.dataDirectory, { withFileTypes: true }).forEach((entry) => {
        if (entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'package.json' && entry.name !== 'package-lock.json') {
          names.add(entry.name.slice(0, -5));
        }
      });
    }
    names.forEach((name) => this.reloadSheet(name));
    this.dirty.clear();
  }

  reloadSheet(name) {
    const file = this.filePath(name);
    if (!fs.existsSync(file)) {
      this.sheets.delete(name);
      return null;
    }
    const records = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(records)) throw new Error(`${name}.json must contain a JSON array.`);
    const sheet = new JsonSheet(this, name, this.recordsToRows(name, records));
    this.sheets.set(name, sheet);
    return sheet;
  }

  replaceRecords(name, records) {
    const sheet = new JsonSheet(this, name, this.recordsToRows(name, records));
    this.sheets.set(name, sheet);
    this.dirty.delete(name);
    return sheet;
  }

  getSheet(name) {
    return this.sheets.get(String(name)) || null;
  }

  insertSheet(name) {
    const key = String(name);
    if (this.sheets.has(key)) return this.sheets.get(key);
    const sheet = new JsonSheet(this, key, [[]]);
    this.sheets.set(key, sheet);
    this.dirty.add(key);
    return sheet;
  }

  spreadsheet() {
    return new JsonSpreadsheet(this);
  }

  sheetToRecords(name) {
    const sheet = this.getSheet(name);
    if (!sheet || !sheet.rows.length) return [];
    const headers = (sheet.rows[0] || []).map((value, index) => String(value || `column_${index + 1}`));
    const lastRow = sheet.getLastRow();
    const records = [];
    for (let rowIndex = 1; rowIndex < lastRow; rowIndex += 1) {
      const row = sheet.rows[rowIndex] || [];
      if (row.every(isBlank)) continue;
      const record = {};
      headers.forEach((header, columnIndex) => {
        const value = row[columnIndex];
        record[header] = value === undefined || value === '' ? null : value;
      });
      records.push(record);
    }
    return records;
  }

  serializeSheet(name) {
    return `${JSON.stringify(this.sheetToRecords(name), null, 2)}\n`;
  }

  dirtyNames() {
    return Array.from(this.dirty);
  }

  flushDirty() {
    fs.mkdirSync(this.dataDirectory, { recursive: true });
    const names = this.dirtyNames();
    names.forEach((name) => fs.writeFileSync(this.filePath(name), this.serializeSheet(name), 'utf8'));
    this.dirty.clear();
    return names;
  }

  snapshot() {
    const sheets = {};
    this.sheets.forEach((sheet, name) => { sheets[name] = clone(sheet.rows); });
    return { sheets, dirty: this.dirtyNames() };
  }

  restore(snapshot, persist) {
    this.sheets.clear();
    Object.entries(snapshot.sheets || {}).forEach(([name, rows]) => {
      this.sheets.set(name, new JsonSheet(this, name, clone(rows)));
    });
    this.dirty = new Set(snapshot.dirty || []);
    if (persist) {
      Object.keys(snapshot.sheets || {}).forEach((name) => {
        fs.writeFileSync(this.filePath(name), this.serializeSheet(name), 'utf8');
      });
    }
  }
}

module.exports = { DEFAULT_HEADERS, JsonWorkbook };
