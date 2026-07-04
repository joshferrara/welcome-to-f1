# Site Review & Improvement Plan (July 3, 2026)

## Scope reviewed

- Full rendered content of `index.html` (all 16 sections, ~5,300 words of prose plus generated grids/tables)
- Content architecture: `data/v1/*.json`, `templates/index.html`, `scripts/build-site.js`, `scripts/validate-data.js`
- Interactive layer: `script.js` (race-week banner, schedule tool, standings, champions tabs, engine audio)
- SEO/meta surfaces: `llms.txt`, `sitemap.xml`, JSON-LD in `guide.json`
- Live data state: `races.json` (10 races complete, 2 cancelled), `standings.json` (updated June 30)
- Visual pass in the browser (hero, race-week banner) plus stored section screenshots

The verdict up front: the content is genuinely good and the visual system is strong. The problems are structural — a flat 16-section list that has outgrown its skeleton, facts duplicated in prose that have drifted out of sync as the season progressed, and a content model (`bodyMarkdown` as one 77KB HTML blob) that makes both problems hard to fix. This plan addresses all three, in order of value.

---

## Diagnosis: five root problems

### 1. The 16-section flat list has outgrown itself

Sections range from 25 words (`#champions`, `#schedule` intros) to 593 words (`#weekend`). Several are fragments of the same topic:

| Symptom | Evidence |
|---|---|
| Strategy topic split in three | Pit Stops (05, 191 words) and Tyres (06, 253 words) are separate sections, and both are really "how races are won" — which also lives in Championships (03, 186 words) |
| History scattered | World Champions (09), Recent History (10), and The Drama (11) are all lore/history but sit as three unrelated stops |
| Tracks vs. Calendar overlap | Both subtitles say the same thing ("24 races in 2026... five continents"). One is evergreen (iconic circuits), one is live-season (schedule tool) — the distinction isn't expressed |
| "Good to Know" (14) is a grab bag | Safety cars and penalties are race-day concepts that belong with Race Weekend; the section title says nothing |
| Live vs. evergreen content mixed | Standings tables live inside the Championships *explainer*; the race-week banner points at a Calendar section numbered 13 of 16 |

### 2. Navigation is three different maps of the same territory

- Desktop navbar: **6 links** (Basics, Race Day, Cars, Drivers, History, Get Started) — no path to Schedule or Standings, the two things a returning visitor wants
- Mobile drawer TOC: all **16 items**, a long undifferentiated list
- Desktop floating rail: **numbers only** (01–16), cryptic until hovered

A first-time reader and a returning fan need different front doors. Neither is well served: the beginner sees an intimidating 16-chapter wall; the returning fan can't reach the live stuff.

### 3. Duplicated facts have drifted (the season moved; the prose didn't)

Concrete inconsistencies on the page today:

- **Race count**: `#basics` intro says "22 Grands Prix"; the same section's closing paragraph and its stat card say "24 races"; `#tracks` and `#schedule` subtitles say "24 races in 2026"; the FAQ correctly explains 24-minus-2-cancelled = 22
- **`llms.txt` is wrong in four places**: lists "Kick Sauber" (now Audi), says Good to Know covers "DRS" (2026 cars don't have DRS — the Cars section itself says so), says races run "~90 minutes" (FAQ says ~2 hours), says Recent History covers "2014 to present" (it starts at 2020)
- **Mid-season staleness**: "Cadillac *joins* as the 11th team" (they've run 10 races), "Mercedes *predicts* 2026 cars could reach 248 mph" (pre-season framing), "F1 25 with a 2026 DLC *coming*"
- **The Ones to Watch is now misleading**: it narrates 2025. Current reality per the site's own standings data: Antonelli leads with 5 wins, Mercedes is 1–2 in both championships, Hamilton is P3 with a win — while the blurb says his "results haven't quite matched the hype." Recent History ends at 2025 with no "2026 so far," halfway through the season the guide is about.
- **Same topic explained twice**: sprint format (Weekend callout + FAQ), cost cap (Teams callout + FAQ), Apple TV (FAQ + Get Started), team radio (three times: Weekend, Drivers intro, Drama), 2021 Silverstone/Monza incidents (History + Drama)

### 4. The content model fights you

`guide.json` claims `contentFormat: "markdown"`, but `bodyMarkdown` is a single 77KB **HTML** string containing the navbar, mobile nav, all 16 sections, footer, and grid placeholders. Consequences:

- Editing content means editing HTML inside a JSON string — the highest-friction possible format
- The three navigation surfaces are hand-maintained inside that blob (the `navigation` array in `guide.json` exists but the nav HTML doesn't come from it)
- The mobile app can't use the guide body at all (its README confirms it only consumes drivers/races/standings/champions) — so the "shared content contract" for the guide itself is fiction
- Section numbers ("01 — The Basics") are hardcoded strings, so any reordering means hand-renumbering in multiple places

### 5. Meta surfaces are hand-maintained and stale

`llms.txt` (see above), `sitemap.xml` `lastmod` (May 23), and the JSON-LD all encode facts that already exist in `data/v1/*.json` but aren't generated from it — even though the build pipeline (`build-site.js`) is exactly the right place to do that.

---

## The plan

Phases are ordered by value-to-effort. Each is independently shippable.

### Phase 1 — Fact repair & freshness pass (small, do first)

Fix what's wrong today without moving anything:

1. Reconcile the race count everywhere. One canonical explanation (Calendar section + FAQ keep the 24-scheduled/22-active story); everywhere else either uses a build-time token (see Phase 3) or drops the brittle number ("a calendar spanning five continents")
2. Rewrite The Ones to Watch for mid-2026: Antonelli's breakout season leading with 5 wins, the Mercedes 1–2, Norris's title defense trailing his own teammate, Hamilton's Ferrari recovery. Keep 2025 context as background, not headline
3. Add a **"2026 so far"** entry at the top of the Recent History timeline (or better: a small auto-generated block from `standings.json` + `races.json` results — the data is already on the page)
4. Sweep pre-season framing: "Cadillac joins" → "joined this season"; "Mercedes predicts 248 mph" → verify whether it happened or reframe; "2026 DLC coming" → verify
5. Fix `llms.txt` by hand now (Kick Sauber → Audi, remove DRS mention, align race length with FAQ, fix history range). Phase 3 makes this permanent
6. Fact-check the FAQ race-length answer ("most races last around 2 hours" — most run ~1.5 hours; 2h is the cutoff, and the answer should say so crisply)

### Phase 2 — New information architecture: 16 sections → 10, in 5 chapters

Keep the single page (see "Sacred cows I examined" below), but give it a shape. Proposed structure:

**Chapter I — The Sport** *(evergreen: what is this thing)*
| # | Section | Built from |
|---|---|---|
| 01 | The Basics | #basics unchanged |
| 02 | Race Weekend | #weekend + safety car/VSC + penalties from #rules (they're race-day concepts; "Good to Know" dissolves) |
| 03 | Winning the Championship | #championships (points, sprint points) — standings tables move out to Chapter IV |

**Chapter II — The Machine** *(evergreen: the hardware)*
| 04 | The Cars | #cars unchanged (2026 era, active aero, power units, engine sounds) |
| 05 | Pit Stops, Tyres & Strategy | #pitstops + #tyres merged — together they're one story (~450 words + the two visuals), told in sequence: why you pit, what you pit for, how strategy wins races. The undercut explainer becomes the payoff |

**Chapter III — The People**
| 06 | The Drivers | #drivers + refreshed Ones to Watch |
| 07 | The Teams | #teams unchanged (cost cap callout stays — canonical home) |

**Chapter IV — The Season** *(the live layer — everything that updates)*
| 08 | The 2026 Season | Live standings tables (from #championships) + "2026 so far" narrative |
| 09 | Tracks & Calendar | #tracks + #schedule merged: iconic-circuit cards lead (evergreen), schedule grid + local-time tool follow (live). Kills the duplicated subtitle; the race-week banner deep-links here |

**Chapter V — The Lore** *(why people are obsessed)*
| 10 | History, Rivalries & Drama | #history + #drama merged (timeline → rivalries → radio moments — it already reads as one arc) + #champions folded in at the end as "The Archive" (the 75-year table is reference material, perfect as a chapter closer) |

**Finale** *(unnumbered)*
- FAQ — trimmed: each answer that duplicates a section gets one crisp paragraph + anchor link instead of a full restatement. The full text stays in JSON-LD for SEO
- Get Started / How to Watch — unchanged; it's the strongest closer on the site

Navigation changes that fall out of this:

- **Desktop navbar**: chapter-level links — Sport, Machine, People, **Season**, Lore, Get Started. The returning fan finally gets a one-click path to standings/schedule
- **Mobile drawer**: sections grouped under chapter headers (10 items in 5 groups scans far better than 16 flat; keep bottom borders on all items per prior design decision)
- **Floating rail**: 10 items instead of 16; consider showing the label on the active item, not just on hover
- **Anchor compatibility**: keep every legacy ID (`#championships`, `#pitstops`, `#tyres`, `#drama`, `#schedule`, `#rules`, `#champions`) as anchor aliases or a tiny hash-redirect map in `script.js`. `llms.txt` is out there citing these URLs — they must not break

### Phase 3 — Single source of truth for facts and meta

1. **Build-time tokens** in content: `{{RACE_COUNT}}`, `{{ACTIVE_RACE_COUNT}}`, `{{SPRINT_COUNT}}`, `{{DRIVER_COUNT}}`, `{{TEAM_COUNT}}` derived from `races.json`/`drivers.json`/`teams.json` by `build-site.js` (it already does exactly this for `{{DRIVER_GRID}}`/`{{TEAM_GRID}}`). A mid-season cancellation then updates every count on the page automatically
2. **Generate `llms.txt`** from `guide.json` section data + live data at build time — it can never drift again
3. **Generate `sitemap.xml` `lastmod`** at build time
4. **Add drift checks to `validate-data.js`**: fail the build if prose contains a hardcoded race/driver/team count that disagrees with the data (a regex sweep for `\d+ races|\d+ drivers|\d+ teams` outside tokens is crude but effective)
5. **Canonical-home rule for duplicated topics**, enforced by convention in the content files: sprint format → Race Weekend; cost cap → Teams; Apple TV → Get Started; team radio → Drama (Weekend keeps one teaser sentence; Drivers intro drops its copy)

### Phase 4 — Content model refactor (makes Phases 1–3 stick)

Restructure `guide.json` so content is editable and the page shell is a template:

1. Move navbar, mobile nav, footer, and section wrappers out of `bodyMarkdown` into `templates/index.html` / build script — generated **from the `navigation`/`chapters` arrays**, so nav can never disagree with sections
2. Split the body into per-section content: `sections[].body` (real markdown or HTML fragments), assembled by `build-site.js`. Section numbers become generated, not hardcoded strings
3. Keep `/data/v1` additive (per the README contract): add `chapters` + `sections[].body` alongside the existing fields; keep `bodyMarkdown` populated for one release, then retire it in `/data/v2` if the mobile app ever wants structured guide content (today it doesn't use it at all)
4. Fix `contentFormat` to tell the truth, whatever it ends up being

This phase pairs naturally with the JS-splitting recommendations already in `CODEBASE_REVIEW.md` (April), which remain valid and untouched by this plan.

### Phase 5 (optional, decide later) — Satellite pages for reference content

If SEO growth becomes a goal: the Calendar, Champions archive, and Standings are exactly the queries people search mid-season ("f1 2026 schedule", "f1 standings", "list of f1 world champions"). A `/calendar`, `/champions`, `/standings` page each — generated from the same JSON, sharing the design system — would target those without touching the guide's single-page identity. The main page keeps its sections; satellite pages are the deep-linkable, always-fresh versions. Sitemap grows from 1 URL to 4.

I'd hold this until Phases 1–4 are done; it's the only item that changes what the site *is* rather than how it's organized.

---

## Sacred cows I examined and kept (with reasons)

- **The single-page format.** I seriously considered splitting into a multi-page site. Recommendation: don't. The one-scroll narrative *is* the product — it's what the Notion guide that inspired it never had, the inbound citations (`llms.txt`) all target anchors on `/`, and the mobile app consumes the data files, not the page. Phase 5 gets the SEO benefits without the identity cost
- **The numbered-chapter conceit.** Keep it — it sets the "read me like a book" expectation — but at 10 sections in 5 chapters it works *for* you again; at 16 flat it reads like a syllabus
- **The FAQ.** Keep it (JSON-LD FAQ markup is valuable) but demote it from full restatement to summary + link
- **The playful voice, the interactive toys** (pit-stop timer, engine audio, unit toggle, champions tabs). All of it earns its place. Nothing in this plan touches them except relocation

## Suggested order of execution

1. **Phase 1** — an afternoon; pure content edits in `guide.json` + `llms.txt`, immediate correctness win
2. **Phase 2** — the big one; a focused day or two including nav rework and anchor aliases
3. **Phase 3** — half a day; mostly `build-site.js` + `validate-data.js`
4. **Phase 4** — a day; mechanical once Phase 2 has settled the structure
5. **Phase 5** — separate decision, separate project
