# Security policy

Do not report secrets or personal data in public issues.

The following files contain sensitive data and belong only in a private data repository:

- `Login.json`
- `Registration.json`
- `Workflow.json`
- `Feedback.json`

If any of these files becomes public, make the repository private, create a clean private history, rotate administrator passwords, and review access logs before deploying again.

All service credentials must be supplied through environment variables or the deployment platform's secret store. They must never be added to HTML, JavaScript sent to browsers, JSON data files, screenshots, commits, or issue text.

