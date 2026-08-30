'use strict';

const { DEFAULT_HEADERS } = require('./json-workbook');

class GitHubJsonSync {
  constructor(options) {
    this.enabled = options.enabled === true;
    this.writeEnabled = options.writeEnabled === true;
    this.requirePrivate = options.requirePrivate !== false;
    this.repository = String(options.repository || 'IKONIXPortal/OSS');
    this.branch = String(options.branch || 'main');
    this.token = String(options.token || '');
    this.apiBase = `https://api.github.com/repos/${this.repository}`;
  }

  headers() {
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'IKONIX-Portal'
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }

  async request(url, options) {
    const response = await fetch(url, Object.assign({}, options || {}, { headers: Object.assign(this.headers(), (options && options.headers) || {}) }));
    const text = await response.text();
    let payload = null;
    try { payload = text ? JSON.parse(text) : null; } catch (error) { payload = text; }
    if (!response.ok) {
      const message = payload && payload.message ? payload.message : `GitHub request failed with HTTP ${response.status}.`;
      throw new Error(message);
    }
    return payload;
  }

  async verifySafety() {
    if (!this.enabled) return;
    if (!this.token) throw new Error('GITHUB_TOKEN is required when GitHub synchronization is enabled.');
    const metadata = await this.request(this.apiBase);
    if (this.requirePrivate && !metadata.private) {
      throw new Error(`Refusing to use public repository ${this.repository} for sensitive IKONIX data. Make it private first.`);
    }
  }

  async getFile(name) {
    const encodedPath = String(name).split('/').map(encodeURIComponent).join('/');
    return this.request(`${this.apiBase}/contents/${encodedPath}?ref=${encodeURIComponent(this.branch)}`);
  }

  async pullInto(workbook) {
    if (!this.enabled) return;
    for (const name of Object.keys(DEFAULT_HEADERS)) {
      const file = await this.getFile(`${name}.json`);
      const records = JSON.parse(Buffer.from(String(file.content || '').replace(/\s/g, ''), 'base64').toString('utf8'));
      if (!Array.isArray(records)) throw new Error(`${name}.json in GitHub must contain a JSON array.`);
      workbook.replaceRecords(name, records);
    }
  }

  async push(workbook, names) {
    if (!this.enabled || !this.writeEnabled || !names.length) return;
    for (const name of names) {
      const fileName = `${name}.json`;
      const current = await this.getFile(fileName);
      const encodedPath = encodeURIComponent(fileName);
      await this.request(`${this.apiBase}/contents/${encodedPath}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Update ${fileName} from IKONIX Portal`,
          branch: this.branch,
          sha: current.sha,
          content: Buffer.from(workbook.serializeSheet(name), 'utf8').toString('base64')
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

module.exports = { GitHubJsonSync };
