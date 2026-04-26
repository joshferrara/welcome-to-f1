# Welcome to Formula 1

Everything you need to know about Formula 1 — the cars, the drivers, the teams, the rules, and why millions of people wake up early on Sundays.

## About

A beginner-friendly, single-page guide to Formula 1 covering the basics of the sport, race weekends, car technology, current drivers and teams, history, and how to start watching.

Inspired by [A Newbie's Guide to Formula 1](https://nonchalant-trawler-767.notion.site/A-Newbie-s-Guide-to-Formula-1-b8baef975f6d42e5963780ea70a4cdb5#main).

## Architecture

The site is a single-page app built from static files — no build tools, no frameworks, no external dependencies. Structured data lives in small JS data files and is version-controlled via git.

Key files:

```
index.html                       # Page structure and content
styles.css                       # Global styles and component styles
races-data.js                    # Canonical race calendar/session data
script.js                        # Client-side behavior and rendering
scripts/update-standings.js      # Automated standings import from Ergast API
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

The standings update script runs automatically during Cloudflare deploys, which are triggered when `main` receives a push. The script fetches driver and constructor standings from `api.jolpi.ca/ergast`, maps team names to match the site's canonical names (e.g., `"Kick Sauber"` → `"Audi"`), and writes the data into `script.js` between the markers. A `standingsLastUpdated` timestamp is also set.

If the API is unavailable, the script warns and leaves existing data untouched.

For local testing, you can run it manually:

```bash
node scripts/update-standings.js
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

## Post-Race Update Workflow

After each race:

1. Add the top 3 results to the race's `results` array in `index.html`
2. Commit and push to `main` — the standings update script runs automatically during the Cloudflare deploy

## Contributing

Contributions are welcome! If you have ideas for improvements, corrections, or new content, feel free to [open an issue](https://github.com/joshferrara/welcome-to-f1/issues) or submit a pull request.

## License

Made with love and Ferrari delusion by [Josh Ferrara](https://joshferrara.com).
