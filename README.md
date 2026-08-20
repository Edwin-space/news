# Edwin Market Brief

Static research dashboard for daily macro, rates, commodities and equity briefs.

## Structure

- `index.html` — dashboard shell
- `styles.css` — design tokens + responsive UI
- `app.js` — report renderer and archive routing
- `data/reports.json` — canonical report data
- `.github/workflows/telegram.yml` — Telegram delivery after report updates

## Publishing a report

Append a report object to `data/reports.json`, then set `latest` to its date. The home view and archive update automatically.

Archive links use `?date=YYYY-MM-DD`, so no extra HTML page needs to be generated for each report.

## Deployment

Recommended: connect this repository to Vercel as a static site with the repository root as the project root. No build command is required.

After deployment, add the public report URL as the GitHub Actions repository variable:

- `REPORT_SITE_URL`

## Telegram

Create a Telegram bot with BotFather and add these GitHub Actions repository secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

The workflow runs whenever `data/reports.json` changes on `main`, and can also be triggered manually from GitHub Actions.

Do not commit bot tokens or chat IDs into the repository.
