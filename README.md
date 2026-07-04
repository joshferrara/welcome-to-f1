# Welcome to Formula 1

Everything you need to know about Formula 1 — the cars, the drivers, the teams, the rules, and why millions of people wake up early on Sundays.

## About

A beginner-friendly, single-page guide to Formula 1 covering the basics of the sport, race weekends, car technology, current drivers and teams, history, and how to start watching.

Inspired by [A Newbie's Guide to Formula 1](https://nonchalant-trawler-767.notion.site/A-Newbie-s-Guide-to-Formula-1-b8baef975f6d42e5963780ea70a4cdb5#main).

## Architecture

The site is deployed as static files, but content is shared through versioned JSON under `data/v1/`. The website is generated at build time from the same JSON files that a mobile app can fetch directly.

Public JSON contract:

```text
/data/v1/manifest.json    # schema version, generated timestamp, base URL, resource URLs
/data/v1/guide.json       # site metadata, chapters, sections (with body), hero, footer, FAQ, JSON-LD, llms facts
/data/v1/drivers.json     # driver IDs, codes, numbers, countries, images, links
/data/v1/teams.json       # team IDs, colors, engines, driver references, links
/data/v1/races.json       # calendar, session times, sprint flags, results, cancellations, images
/data/v1/standings.json   # driver and constructor standings plus lastUpdated
/data/v1/champions.json   # champion history and display metadata
```

### Content model (`guide.json`)

The guide is authored as **structured sections grouped into chapters**, not one HTML blob:

- `chapters[]` — ordered chapters (`sport`, `machine`, `people`, `season`, `lore`, and a `finale` group). Chapters drive the three navigation surfaces.
- `sections[]` — each has `id`, `chapter`, `navLabel`, optional `eyebrowLabel`, `className`, optional `aliases` (legacy anchor ids), `numbered` (false for finale sections), a `header` (`title` + `subtitle`), and an HTML `body`. Section numbers (01–10) are assigned at build time from order, so reordering never means hand-renumbering.
- `hero` / `footer` — page chrome as HTML.
- `faq[]` — the single source for both the on-page FAQ and the JSON-LD `FAQPage`.
- `llms` — `summary` + `keyFacts` used to generate `llms.txt`.

`scripts/build-site.js` generates the navbar, mobile drawer (grouped by chapter), and floating rail from `chapters`/`sections` — the nav can never drift from the section list. It also injects `{{DRIVER_GRID}}` / `{{TEAM_GRID}}`.

### Count tokens (single source of truth)

Prose uses build-time tokens so season counts never drift as races are cancelled or teams change:

```text
{{SEASON}} {{DRIVER_COUNT}} {{TEAM_COUNT}} {{RACE_COUNT}}
{{ACTIVE_RACE_COUNT}} {{CANCELLED_COUNT}} {{SPRINT_COUNT}} {{CONTINENTS}}
```

These are computed from `drivers.json` / `teams.json` / `races.json`. `validate-data.js` fails the build if a section hardcodes a count (`\d+ drivers|teams|Grands Prix`) that disagrees with the data (the `history` section is exempt for historical figures). `{{ASSET_VERSION}}` cache-busts CSS/JS on every build.

### Generated files

```text
index.html                # generated single-page guide
calendar/index.html       # generated /calendar satellite page
standings/index.html      # generated /standings satellite page
champions/index.html      # generated /champions satellite page
site-data.js              # generated runtime data for interactive widgets
llms.txt                  # generated from guide.json + live data
sitemap.xml               # generated (all four page routes, build-date lastmod)
```

### Source/editing files

```text
templates/index.html      # HTML shell for the guide (head + {{BODY}})
templates/page.html       # HTML shell for satellite pages
data/v1/*.json            # canonical web/mobile content
script.js                 # client-side behavior (guard-safe; reused on all pages)
styles.css                # global styles and component styles
scripts/build-site.js     # renders pages, site-data.js, llms.txt, sitemap.xml
scripts/validate-data.js  # validates JSON contract, references, dates, assets, count drift
scripts/update-data.js    # deploy-time updater orchestrator
scripts/update-races.js   # refreshes data/v1/races.json from Ergast/Jolpica
scripts/update-standings.js # refreshes data/v1/standings.json from Ergast/Jolpica
```

### Satellite pages

`/calendar`, `/standings`, and `/champions` are standalone pages generated from the same JSON, sharing `styles.css` and the guard-safe `script.js`. They give returning fans and search engines deep-linkable, always-fresh views of the live data. The guide's `#tracks`, `#schedule`, `#pitstops`, `#tyres`, `#drama`, `#champions`, and `#rules` anchors are preserved as aliases so existing inbound links keep working after the section reorganization.

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

- Asset paths in JSON are root-relative, for example `/images/drivers/lando-norris.webp` or `/images/races/great-britain.webp`.
- Consumers compute time-sensitive states, such as race week, from UTC session fields in `races.json`.
- Race consumers should prefer each race's optional `image` and `imageAlt` fields, falling back to generic app imagery only when omitted.
- `/data/v1/` is additive-only. Breaking changes should publish a new `/data/v2/` contract.
- `_headers` exposes `/data/v1/*` with `Access-Control-Allow-Origin: *` and a short cache window.

## Content Workflow

Most content changes should happen in `data/v1/*.json`, followed by:

```bash
npm run validate:data
npm run build
```

Driver and team cards are generated from `drivers.json` and `teams.json`. Guide prose lives in `guide.json` as per-section HTML `body` fields; edit the relevant section's `body`. The `drivers` section body carries `{{DRIVER_GRID}}` and the `teams` section body carries `{{TEAM_GRID}}`; `scripts/build-site.js` fills those and all count tokens. To add, remove, or reorder a section, edit `chapters`/`sections` in `guide.json` — numbering and every navigation surface update automatically.

Note on the `/data/v1/` contract: reshaping `guide.json`'s internal content model (chapters + per-section bodies) is an authoring change, not a break to the published *resource URLs or asset-path conventions* that mobile clients depend on — those are unchanged. `guide.json` carries `schemaVersion: 2` to mark the new internal shape.

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

Race imagery is curated in the same file with optional root-relative `image` and `imageAlt` fields. `scripts/update-races.js` preserves curated fields such as `results`, `cancelled`, `isNew`, `raceNote`, `image`, and `imageAlt`.

## Standings

Driver and constructor standings live in `data/v1/standings.json`.

`scripts/update-standings.js` fetches current standings from `api.jolpi.ca/ergast`, maps constructor/team names to the site's canonical names, and writes the JSON file. If either external fetch fails, the updater keeps the existing data for that half of the standings.

## License

Made with love and Ferrari delusion by [Josh Ferrara](https://joshferrara.com).
