# Welcome to Formula 1

Everything you need to know about Formula 1 — the cars, the drivers, the teams, the rules, and why millions of people wake up early on Sundays.

## About

A beginner-friendly, single-page guide to Formula 1 covering the basics of the sport, race weekends, car technology, current drivers and teams, history, and how to start watching.

Inspired by [A Newbie's Guide to Formula 1](https://nonchalant-trawler-767.notion.site/A-Newbie-s-Guide-to-Formula-1-b8baef975f6d42e5963780ea70a4cdb5#main).

## Architecture

The site is a single-page app built from static files — no build tools, no frameworks, no external dependencies. Structured data lives in small JS data files and is version-controlled via git. At deploy time, a few small Node scripts refresh the standings and schedule data files in-place from the public Ergast API.

Key files:

```
index.html                       # Page structure and content
styles.css                       # Global styles and component styles
races-data.js                    # Canonical race calendar/session data
script.js                        # Client-side behavior and rendering
scripts/update-data.js           # Build-time orchestrator that runs every updater below
scripts/update-standings.js      # Automated standings import from Ergast API
scripts/update-races.js          # Automated race calendar/session time import from Ergast API
screenshot.js                    # Playwright script for OG image generation
research/                        # F1 research notes and 2026 grid info
```

## Race Week Banner

A banner appears at the top of the page during race weekends to highlight the current event.

**How the window is calculated:**

1. Each race in the `races` array has `fp1` and `race` datetimes in UTC.
2. The window opens **4 days before FP1** (midnight local time).
3. The window closes **3 hours after the race start** (to account for race duration).
4. The banner only shows if the race has no `results` and is not `cancelled`.

When active, the banner displays the race name, round number, location, local session dates, and the visitor's detected timezone abbreviation. The matching calendar item also gets a red "RACE WEEK" highlight.

**Testing with a date override:**

You can simulate any date by adding a `?date=YYYYMMDD` query parameter:

```
index.html?date=20260327
```

This sets the current time to noon on that date, useful for testing the banner and calendar states without waiting for an actual race week.

## Race Calendar & Results

The calendar section renders every race from the `races` array at the bottom of `index.html`. Each race can be in one of four states:

| State | Condition | Visual |
|-------|-----------|--------|
| **Upcoming** | Future race, no results | Default styling |
| **Race Week** | Within the race week window (see above) | Red background, "RACE WEEK" badge |
| **Completed** | Past race end time OR `results` is set | Dimmed (55% opacity), green checkmark, podium shown |
| **Cancelled** | `cancelled: true` | Dimmed (45% opacity), strikethrough name, red "✗", "CANCELLED" badge |

### Adding Race Results

After a race finishes, manually add the top 3 finishers as an array of driver codes to the race object:

```javascript
// Before
{ round: 3, name: 'Japanese Grand Prix', location: 'Suzuka', fp1: '2026-03-27T02:30Z', race: '2026-03-29T05:00Z', results: null },

// After
{ round: 3, name: 'Japanese Grand Prix', location: 'Suzuka', fp1: '2026-03-27T02:30Z', race: '2026-03-29T05:00Z', results: ['VER', 'NOR', 'LEC'] },
```

Once results are set, the race is marked as completed in the calendar regardless of the current date, and the race week banner will no longer show for that round. The podium display renders the three driver codes with gold, silver, and bronze styling.

### Cancelling a Race

Add `cancelled: true` to the race object:

```javascript
{ round: 4, name: 'Bahrain Grand Prix', location: 'Sakhir', fp1: '...', race: '...', results: null, cancelled: true },
```

## Standings & Points

Driver and constructor standings are stored in `script.js` between `// STANDINGS_DATA_START` and `// STANDINGS_DATA_END` markers. This data populates the standings tables and injects points into individual driver and team cards throughout the page.

### Automated Import (at Deploy Time)

Standings refresh on every Cloudflare deploy. The Cloudflare Pages **Build command** is `node scripts/update-data.js` — an orchestrator that runs each updater in `scripts/` in sequence (currently `update-standings.js` then `update-races.js`), streams their output through, and propagates a non-zero exit if any of them errors. Adding a new updater means appending to the `scripts` array in `update-data.js` rather than touching the dashboard.

The standings step fetches driver and constructor standings from `api.jolpi.ca/ergast`, maps team names to match the site's canonical names (e.g., `"Kick Sauber"` → `"Audi"`), writes the data into `script.js` between the `STANDINGS_DATA_START`/`STANDINGS_DATA_END` markers, and sets a `standingsLastUpdated` timestamp.

If the API is unavailable, the script warns and leaves existing data untouched.

For local testing:

```bash
node scripts/update-standings.js   # standings only
node scripts/update-data.js        # everything the deploy runs
```

### Manual Update

You can also edit the standings data directly in `script.js`. The data structures look like:

```javascript
const driverStandings = [
  { pos: 1, code: "RUS", name: "George Russell", team: "Mercedes-AMG", points: 33, wins: 1 },
  // ...
];

const constructorStandings = [
  { pos: 1, name: "Mercedes-AMG", points: 55, wins: 1 },
  // ...
];

const standingsLastUpdated = "2026-03-14T15:45:24.261Z";
```

### Team Name Mapping

The update script maps API team names to the canonical names used on the site. Both constructor IDs and display names are mapped — see `CONSTRUCTOR_NAME_MAP` and `TEAM_NAME_MAP` in `scripts/update-standings.js`. If a new team joins or a team rebrands, update these maps.

## Race Calendar Sync

Session times in `races-data.js` are kept in sync with the FIA-published schedule by `scripts/update-races.js`, which runs at deploy time alongside `update-standings.js` via the `update-data.js` orchestrator.

### Automated Import (at Deploy Time)

The script fetches the season from `api.jolpi.ca/ergast/f1/2026.json` and rewrites only the time strings (`fp1`, `fp2`, `fp3`, `sprintQualifying`, `sprint`, `qualifying`, `race`) on each race line, matched by `round` number.

It is intentionally surgical: it preserves curated fields (`name`, `location`, `results`, `cancelled`, `isNew`, `raceNote`, etc.), the `Summer Break`/`Winter Break` rows, and the file's hand-formatted single-line-per-race layout. It only touches time fields that already exist on a line, so a sprint↔regular weekend reclassification stays a manual change.

If the API is unavailable, the script warns and leaves the file untouched.

For local testing:

```bash
node scripts/update-races.js
```

### Flagging a Schedule Change (`raceNote`)

To call out a one-off schedule change on a single session row in the race-week timeline (e.g. an early race start due to forecasted rain), add a `raceNote` to that race in `races-data.js`:

```javascript
{ round: 6, name: 'Miami Grand Prix', /* ...session times... */, raceNote: { session: 'race', text: 'Moved earlier', title: 'Race start moved earlier due to forecasted rain' } }
```

| Field | Required | Notes |
|-------|----------|-------|
| `session` | Optional | Which row the badge attaches to: `'fp1'`, `'fp2'`, `'fp3'`, `'sprintQualifying'`, `'sprint'`, `'qualifying'`, or `'race'`. Defaults to `'race'`. If the key doesn't exist for that weekend (e.g. `'fp2'` on a sprint weekend), the badge silently doesn't render. |
| `text` | Required | Short label shown as a small inline badge next to the session label (e.g. `Moved earlier`, `Curfew shift`). |
| `title` | Optional | Tooltip shown on hover (e.g. `Race start moved earlier due to forecasted rain`). |

The actual session time is updated by `update-races.js` on the next deploy once the new time is published to Ergast — the `raceNote` flag persists separately, so the badge stays put through the time refresh. Remove the `raceNote` field once the change is no longer noteworthy.

## Post-Race Update Workflow

After each race:

1. Add the top 3 results to the race's `results` array in `races-data.js`
2. Commit and push to `main` — the Cloudflare deploy runs `scripts/update-data.js`, which refreshes the standings and the calendar from Ergast

## Contributing

Contributions are welcome! If you have ideas for improvements, corrections, or new content, feel free to [open an issue](https://github.com/joshferrara/welcome-to-f1/issues) or submit a pull request.

## License

Made with love and Ferrari delusion by [Josh Ferrara](https://joshferrara.com).
