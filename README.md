# Edwin Market Brief

Static research dashboard for daily macro, rates, commodities and equity briefs.

## Structure

- `index.html` — dashboard shell
- `styles.css` — design tokens + responsive UI
- `app.js` — report renderer and archive routing
- `data/reports.json` — canonical report data
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/telegram.yml` — Telegram delivery after report updates

## Publishing a report

Append a report object to `data/reports.json`, then set `latest` to its date. The home view and archive update automatically.

Archive links use `?date=YYYY-MM-DD`, so no extra HTML page needs to be generated for each report.

## GitHub Pages deployment

The site deploys from `main` through GitHub Actions and will be available at:

- `https://edwin-space.github.io/news/`

Before the first deployment:

1. Make the repository public, or upgrade to a GitHub plan that supports Pages for private repositories.
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Merge this pull request into `main`.
4. Confirm that the **Deploy report site to GitHub Pages** workflow succeeds.

The site uses document-relative asset URLs, so styles, scripts, report data, and archive links work from the project path `/news/`.

After deployment, set the GitHub Actions repository variable below to the public Pages URL:

- `REPORT_SITE_URL=https://edwin-space.github.io/news/`

## Telegram

Create a Telegram bot with BotFather and add these GitHub Actions repository secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

The Telegram workflow runs whenever `data/reports.json` changes on `main`, and can also be triggered manually from GitHub Actions.

Do not commit bot tokens or chat IDs into the repository.
