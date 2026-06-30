# Welcome to Formula 1

Everything you need to know about Formula 1 — the cars, the drivers, the teams, the rules, and why millions of people wake up early on Sundays.

## About

A beginner-friendly, single-page guide to Formula 1 covering the basics of the sport, race weekends, car technology, current drivers and teams, history, and how to start watching.

Inspired by [A Newbie's Guide to Formula 1](https://nonchalant-trawler-767.notion.site/A-Newbie-s-Guide-to-Formula-1-b8baef975f6d42e5963780ea70a4cdb5#main).

## Architecture

The site is still deployed as static files, but content is now shared through versioned JSON under `data/v1/`. The website is generated at build time from the same JSON files that a mobile app can fetch directly.

Public JSON contract:

```text
/data/v1/manifest.json    # schema version, generated timestamp, base URL, resource URLs
/data/v1/guide.json       # page metadata, navigation, hero, guide body, FAQ, JSON-LD
/data/v1/drivers.json     # driver IDs, codes, numbers, countries, images, links
/data/v1/teams.json       # team IDs, colors, engines, driver references, links
/data/v1/races.json       # calendar, session times, sprint flags, results, cancellations
/data/v1/standings.json   # driver and constructor standings plus lastUpdated
/data/v1/champions.json   # champion history and display metadata
```

Generated files:

```text
index.html                # generated static page
site-data.js              # generated runtime data for interactive widgets
```

Source/editing files:

```text
templates/index.html      # HTML shell around generated body/scripts
data/v1/*.json            # canonical web/mobile content
script.js                 # client-side behavior only
styles.css                # global styles and component styles
scripts/build-site.js     # renders index.html and site-data.js
scripts/validate-data.js  # validates JSON contract, references, dates, assets
scripts/update-data.js    # deploy-time updater orchestrator
scripts/update-races.js   # refreshes data/v1/races.json from Ergast/Jolpica
scripts/update-standings.js # refreshes data/v1/standings.json from Ergast/Jolpica
```

## Commands

Install dependencies:

```bash
npm install
```

Validate the public data contract:

```bash
npm run validate:data
```

Build the static website from JSON:

```bash
npm run build
```

Refresh external race/standings data:

```bash
npm run update:data
```

Cloudflare Pages should use:

```bash
npm run build:deploy
```

That command refreshes external data first, then validates and rebuilds the generated static files.

## Mobile Data Contract

The mobile app should start at `/data/v1/manifest.json`, then resolve the listed resource URLs against `manifest.baseUrl`.

Contract rules:

- Asset paths in JSON are root-relative, for example `/images/drivers/lando-norris.webp`.
- Consumers compute time-sensitive states, such as race week, from UTC session fields in `races.json`.
- `/data/v1/` is additive-only. Breaking changes should publish a new `/data/v2/` contract.
- `_headers` exposes `/data/v1/*` with `Access-Control-Allow-Origin: *` and a short cache window.

## Content Workflow

Most content changes should happen in `data/v1/*.json`, followed by:

```bash
npm run validate:data
npm run build
```

Driver and team cards are generated from `drivers.json` and `teams.json`. The guide page body lives in `guide.json` as a Markdown-compatible HTML body with `{{DRIVER_GRID}}` and `{{TEAM_GRID}}` placeholders. Those placeholders are filled by `scripts/build-site.js`.

## Race Calendar & Results

Race data lives in `data/v1/races.json`. Each race can be in one of four states:

| State | Condition |
|-------|-----------|
| Upcoming | Future race, no results |
| Race Week | Within the race-week window |
| Completed | Past race end time or `results` is set |
| Cancelled | `cancelled: true` |

After each race, add the top 3 finishers to the race's `results` array:

```json
"results": ["VER", "NOR", "LEC"]
```

To cancel a race, add:

```json
"cancelled": true
```

To flag a one-off session change, add `raceNote` to the race:

```json
"raceNote": {
  "session": "race",
  "offsetMinutes": -180,
  "text": "Moved earlier",
  "title": "Race start moved 3 hours earlier due to forecasted rain"
}
```

`scripts/update-races.js` preserves curated fields such as `results`, `cancelled`, `isNew`, and `raceNote`.

## Standings

Driver and constructor standings live in `data/v1/standings.json`.

`scripts/update-standings.js` fetches current standings from `api.jolpi.ca/ergast`, maps constructor/team names to the site's canonical names, and writes the JSON file. If either external fetch fails, the updater keeps the existing data for that half of the standings.

## License

Made with love and Ferrari delusion by [Josh Ferrara](https://joshferrara.com).
