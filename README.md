# IKONIX Portal — GitHub migration

This repository is the GitHub/Node replacement for the Google Apps Script project **Ikonix: Recruitment**.

The original interface and server workflow are preserved:

- `public/index.html` is the current Apps Script `Index.html`.
- `public/gas-bridge.js` emulates `google.script.run` over `/api/rpc`.
- `server/apps-script/Code.gs` is the current Apps Script `Code.gs` running through a Node compatibility layer.
- The seven root JSON files replace the seven Google Sheets tabs.

## Security first

`Login.json` contains authentication hashes and salts, and `Registration.json` contains personal information. They must not be stored in a public repository.

Before deploying:

1. Make the data repository private. Because the files are already in public Git history, the safest remediation is a new private repository with a clean history.
2. Reset all admin passwords. Existing hashes can be attacked offline after public exposure.
3. Use a server-side GitHub token. Never put `GITHUB_TOKEN`, Telegram tokens, or SMTP credentials in `public/` or frontend JavaScript.
4. Keep GitHub secret scanning and dependency alerts enabled.

The application refuses to enable GitHub synchronization against a public repository unless that safety check is explicitly disabled.

## Why a Node service is required

GitHub Pages can serve the HTML, but it cannot securely execute `Code.gs`, send OTPs, keep admin sessions, receive Telegram webhooks, or update JSON. The complete flow therefore needs a Node host connected to this GitHub repository.

The Node service serves both the frontend and API from one origin. A Pages-only frontend is optional, but it must point `window.IKONIX_API_BASE` to the separately hosted Node API.

## Local setup

Requirements: Node.js 20 or newer.

```bash
corepack enable
pnpm install
copy .env.example .env
pnpm test
pnpm start
```

Open `http://localhost:3000`.

## Configuration

Copy `.env.example` to `.env` and set:

- `PUBLIC_BASE_URL`: public HTTPS address of the Node service.
- `SMTP_*`: SMTP account used for email OTPs and email notifications.
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_WEBHOOK_KEY`: Telegram bot credentials.
- `TIME_ZONE`: defaults to `Asia/Manila`.
- `RUNTIME_STATE_FILE` and `UPLOAD_DIR`: mount both on persistent storage in production.

For GitHub-backed JSON synchronization:

- Set `GITHUB_SYNC_ENABLED=true`.
- Set `GITHUB_WRITE_ENABLED=true` to commit mutations.
- Set `GITHUB_DATA_REPO=owner/private-repository`.
- Use a fine-grained `GITHUB_TOKEN` with Contents read/write access only to that private repository.

The service pulls JSON at startup and commits changed JSON files after successful mutations.

## Scheduled work

Set `ENABLE_JOBS=true` on the single production worker. It runs:

- scheduled Telegram announcements every minute;
- orientation reminders hourly;
- the weekly report Sunday at 10:00 PM in `TIME_ZONE`.

Run scheduled work on only one instance to avoid duplicate Telegram posts.

## Files and media

Existing Drive URLs continue to work. New registration photos, announcement photos, and library uploads are written to `UPLOAD_DIR` and served under `/uploads/`. Production must provide a persistent volume for this directory.

For the Facebook-link guide thumbnails, set `FACEBOOK_GUIDE_SLIDES_JSON` to an array such as:

```json
[
  {"objectId":"slide-1","imageUrl":"https://example.com/slide-1.png","width":1600,"height":900}
]
```

## Telegram webhook

The webhook endpoint is:

```text
https://your-service.example.com/api/telegram/webhook?telegramWebhookKey=YOUR_SECRET
```

Once the production environment is configured, use the existing portal setup function or Telegram API to register that URL.

## Deployment

Deploy this repository to a stateful Node/Docker host connected to GitHub. Configure the environment variables as host secrets and mount persistent storage for `.runtime/` and `public/uploads/`.

Do not deploy the repository as GitHub Pages alone if registration, OTP, admin login, announcements, uploads, or workflow updates must remain functional.
