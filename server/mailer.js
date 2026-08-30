'use strict';

const nodemailer = require('nodemailer');

function createMailer(environment) {
  const host = String(environment.SMTP_HOST || '').trim();
  const user = String(environment.SMTP_USER || '').trim();
  const pass = String(environment.SMTP_PASS || '');
  const from = String(environment.SMTP_FROM || user || '').trim();
  const consoleMode = String(environment.MAIL_MODE || '').toLowerCase() === 'console';
  const transporter = host
    ? nodemailer.createTransport({
      host,
      port: Number(environment.SMTP_PORT || 587),
      secure: String(environment.SMTP_SECURE || '').toLowerCase() === 'true',
      auth: user ? { user, pass } : undefined
    })
    : null;

  return {
    async verify() {
      if (transporter) await transporter.verify();
    },
    async sendAll(messages) {
      for (const message of messages || []) {
        if (consoleMode) {
          console.log(`[MAIL console mode] to=${message.to} subject=${message.subject}`);
          continue;
        }
        if (!transporter || !from) {
          throw new Error('Email delivery is not configured. Set the SMTP_* environment variables.');
        }
        await transporter.sendMail({
          from,
          to: message.to,
          subject: message.subject,
          text: message.body || message.text || '',
          html: message.htmlBody || message.html || undefined,
          replyTo: message.replyTo || undefined,
          name: message.name || undefined
        });
      }
    }
  };
}

module.exports = { createMailer };
