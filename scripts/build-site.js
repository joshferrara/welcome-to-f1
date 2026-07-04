#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'v1');
const BASE_URL = 'https://welcometof1.com';
const SEASON = 2026;

function readJSON(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${name}.json`), 'utf8'));
}

function writeJSON(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Derived season facts (single source of truth for counts) ──────────────
function computeFacts({ drivers, teams, races }) {
  const raceRows = races.races.filter((r) => !r.type);
  const scheduled = raceRows.length;
  const cancelled = raceRows.filter((r) => r.cancelled).length;
  const sprints = raceRows.filter((r) => r.sprintWeekend).length;
  return {
    SEASON: String(SEASON),
    DRIVER_COUNT: String(drivers.drivers.length),
    TEAM_COUNT: String(teams.teams.length),
    RACE_COUNT: String(scheduled),
    ACTIVE_RACE_COUNT: String(scheduled - cancelled),
    CANCELLED_COUNT: String(cancelled),
    SPRINT_COUNT: String(sprints),
    CONTINENTS: '5',
    ASSET_VERSION: Date.now().toString(36),
  };
}

function applyTokens(text, facts) {
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => (key in facts ? facts[key] : match));
}

// ── Social + grid rendering ───────────────────────────────────────────────
function socialIcon(platform) {
  if (platform === 'instagram') {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
  }
  if (platform === 'tiktok') {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
}

function renderSocialLinks(links = []) {
  if (!links.length) return '';
  return `<div class="social-links">
${links.map((link) => {
    return `            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(link.label)}">${socialIcon(link.platform)}</a>`;
  }).join('\n')}
          </div>`;
}

function renderDriverGrid(drivers) {
  return drivers
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((driver) => {
      const tag = driver.tag ? `          <span class="driver-card__tag">${escapeHtml(driver.tag)}</span>\n` : '';
      return `      <div class="driver-card" data-team="${escapeHtml(driver.teamId)}">
        <img class="driver-card__photo" src="${escapeHtml(driver.image)}" alt="${escapeHtml(driver.imageAlt || driver.name)}" loading="lazy">
        <div class="driver-card__info">
          <div class="driver-card__number">${escapeHtml(driver.number)}</div>
          <div class="driver-card__flag">${escapeHtml(driver.flag)}</div>
          <div class="driver-card__name">${escapeHtml(driver.name)}</div>
          <div class="driver-card__team">${escapeHtml(driver.displayTeam)}</div>
${tag}${renderSocialLinks(driver.links?.social)}
        </div>
      </div>`;
    })
    .join('\n');
}

function renderTeamGrid(teams) {
  return teams
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((team) => {
      const badge = team.badge ? `          <div class="team-card__badge">${escapeHtml(team.badge)}</div>\n` : '';
      return `      <div class="team-card">
        <div class="team-card__color" style="background: ${escapeHtml(team.color)};"></div>
        <div class="team-card__info">
          <div class="team-card__name">${escapeHtml(team.name)}</div>
          <div class="team-card__engine">${escapeHtml(team.engine)}</div>
          <div class="team-card__drivers">${team.driverNames.map(escapeHtml).join(' &bull; ')}</div>
${badge}${renderSocialLinks(team.links?.social)}
        </div>
      </div>`;
    })
    .join('\n');
}

// ── Section-number assignment (numbered sections only) ────────────────────
function numberSections(sections) {
  let counter = 0;
  const numbers = {};
  for (const section of sections) {
    if (section.numbered === false) continue;
    counter += 1;
    numbers[section.id] = String(counter).padStart(2, '0');
  }
  return numbers;
}

function eyebrowText(section, numbers) {
  const label = section.eyebrowLabel || section.navLabel;
  const number = numbers[section.id];
  return number ? `${number} — ${label}` : label;
}

// ── Navigation surfaces (generated from chapters + sections) ──────────────
function sectionsByChapter(chapters, sections) {
  return chapters.map((chapter) => ({
    chapter,
    sections: sections.filter((s) => s.chapter === chapter.id),
  }));
}

function renderNavbar(chapters, sections, numbers) {
  const contentChapters = chapters.filter((c) => !c.finale);
  const links = contentChapters.map((chapter) => {
    const first = sections.find((s) => s.chapter === chapter.id);
    return `      <li><a href="#${first.id}">${escapeHtml(chapter.navLabel)}</a></li>`;
  });
  const start = sections.find((s) => s.id === 'start');
  if (start) links.push(`      <li><a href="#${start.id}">${escapeHtml(start.navLabel)}</a></li>`);
  return `<nav class="navbar" id="navbar">
  <div class="navbar__inner">
    <a href="#top" class="navbar__logo">
      <span class="navbar__logo-mark">F1</span>
      Welcome to Formula 1
    </a>
    <ul class="navbar__links">
${links.join('\n')}
    </ul>
    <div class="navbar__actions">
      <div class="unit-toggle" role="radiogroup" aria-label="Unit system">
        <button class="unit-toggle__btn active" data-action="set-units" data-unit="imperial">mph</button>
        <button class="unit-toggle__btn" data-action="set-units" data-unit="metric">km/h</button>
      </div>
      <button class="theme-toggle" data-action="toggle-theme" aria-label="Toggle theme">
        <span class="icon-sun">☀</span>
        <span class="icon-moon">☾</span>
      </button>
      <button class="navbar__hamburger" id="hamburgerBtn" data-action="toggle-mobile-nav" aria-label="Open menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>
</nav>`;
}

function renderMobileNav(chapters, sections, numbers) {
  const groups = sectionsByChapter(chapters, sections)
    .filter((g) => g.sections.length)
    .map(({ chapter, sections: groupSections }) => {
      const items = groupSections.map((section) => {
        const number = numbers[section.id] || '·';
        return `        <li><a href="#${section.id}" class="mobile-nav__toc-link" data-section="${section.id}" data-action="close-mobile-nav"><span class="mobile-nav__toc-number">${number}</span><span class="mobile-nav__toc-name">${escapeHtml(section.navLabel)}</span></a></li>`;
      });
      return `      <div class="mobile-nav__group">
        <div class="mobile-nav__group-label">${escapeHtml(chapter.label)}</div>
        <ul class="mobile-nav__toc-list">
${items.join('\n')}
        </ul>
      </div>`;
    });
  return `<div class="mobile-nav" id="mobileNav">
  <div class="mobile-nav__inner">
    <div class="mobile-nav__toc-label">Contents</div>
${groups.join('\n')}
  </div>
  <div class="mobile-nav__actions">
    <div class="unit-toggle" role="radiogroup" aria-label="Unit system">
      <button class="unit-toggle__btn active" data-action="set-units" data-unit="imperial">mph</button>
      <button class="unit-toggle__btn" data-action="set-units" data-unit="metric">km/h</button>
    </div>
  </div>
</div>`;
}

function renderToc(chapters, sections, numbers) {
  const items = sections
    .filter((s) => s.numbered !== false)
    .map((section) => {
      const number = numbers[section.id];
      return `      <li><a href="#${section.id}" class="toc__link" data-section="${section.id}"><span class="toc__number">${number}</span><span class="toc__name">${escapeHtml(section.navLabel)}</span></a></li>`;
    });
  return `<nav class="toc" id="toc" aria-label="Table of contents">
  <div class="toc__inner">
    <div class="toc__label">Contents</div>
    <ul class="toc__list">
${items.join('\n')}
    </ul>
  </div>
</nav>`;
}

// ── Section rendering ─────────────────────────────────────────────────────
function renderSection(section, numbers, grids) {
  const cls = section.className || 'section-space';
  const anchors = (section.aliases || [])
    .map((alias) => `<span class="section-anchor" id="${alias}" aria-hidden="true"></span>`)
    .join('\n');
  let header = '';
  if (section.header) {
    header = `    <div class="section-header reveal">
      <span class="section-header__number">${escapeHtml(eyebrowText(section, numbers))}</span>
      <h2 class="section-header__title">${section.header.title}</h2>
      <p class="section-header__subtitle">${section.header.subtitle}</p>
    </div>

`;
  }
  let body = section.body
    .replace('{{DRIVER_GRID}}', grids.driverGrid)
    .replace('{{TEAM_GRID}}', grids.teamGrid);
  const anchorBlock = anchors ? `${anchors}\n` : '';
  return `${anchorBlock}<section class="${cls}" id="${section.id}">
  <div class="container">
${header}    ${body}
  </div>
</section>`;
}

function renderSections(sections, numbers, grids) {
  return sections
    .map((section) => renderSection(section, numbers, grids))
    .join('\n\n<hr class="section-divider">\n\n');
}

// ── Page assembly ─────────────────────────────────────────────────────────
function assembleBody({ guide, drivers, teams }) {
  const { chapters, sections } = guide;
  const numbers = numberSections(sections);
  const grids = {
    driverGrid: renderDriverGrid(drivers.drivers),
    teamGrid: renderTeamGrid(teams.teams),
  };
  return [
    renderNavbar(chapters, sections, numbers),
    renderMobileNav(chapters, sections, numbers),
    renderToc(chapters, sections, numbers),
    guide.hero,
    '<hr class="section-divider">',
    renderSections(sections, numbers, grids),
    guide.footer,
  ].join('\n\n');
}

function writeManifest() {
  const manifest = {
    schemaVersion: 1,
    season: SEASON,
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    resources: {
      guide: '/data/v1/guide.json',
      drivers: '/data/v1/drivers.json',
      teams: '/data/v1/teams.json',
      races: '/data/v1/races.json',
      standings: '/data/v1/standings.json',
      champions: '/data/v1/champions.json',
    },
  };
  writeJSON(path.join(DATA_DIR, 'manifest.json'), manifest);
  return manifest;
}

function writeSiteData({ manifest, drivers, teams, races, standings, champions }) {
  const siteData = {
    manifest,
    drivers: drivers.drivers,
    teams: teams.teams,
    races,
    standings,
    champions,
  };
  const js = `window.siteData = ${JSON.stringify(siteData, null, 2)};\nwindow.racesData = window.siteData.races && window.siteData.races.races ? window.siteData.races.races : [];\n`;
  fs.writeFileSync(path.join(ROOT, 'site-data.js'), js, 'utf8');
}

// Populate the JSON-LD graph from the single-source content (FAQ, sections, date)
// so it can never drift from the on-page copy.
function buildStructuredData(guide) {
  const graph = JSON.parse(JSON.stringify(guide.structuredData));
  const today = new Date().toISOString().slice(0, 10);
  const sectionLabels = guide.sections.map((s) => s.navLabel);
  for (const node of graph['@graph'] || []) {
    if (node['@type'] === 'WebPage' || node['@type'] === 'Article') {
      node.dateModified = today;
    }
    if (node['@type'] === 'Article') {
      node.articleSection = sectionLabels;
    }
    if (node['@type'] === 'FAQPage') {
      node.mainEntity = (guide.faq || []).map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      }));
    }
  }
  return graph;
}

function renderIndex({ guide, drivers, teams, facts }) {
  const template = fs.readFileSync(path.join(ROOT, 'templates', 'index.html'), 'utf8');
  const body = applyTokens(assembleBody({ guide, drivers, teams }).trim(), facts);
  const structuredData = applyTokens(JSON.stringify(buildStructuredData(guide), null, 2), facts);
  const html = applyTokens(template, facts)
    .replace('{{BODY}}', body)
    .replace('{{STRUCTURED_DATA}}', structuredData);
  fs.writeFileSync(path.join(ROOT, 'index.html'), html, 'utf8');
}

// ── Generated meta surfaces (llms.txt, sitemap.xml) ───────────────────────
function buildLlmsTxt({ guide, facts, standings }) {
  const { site, sections } = guide;
  const lines = [];
  lines.push('# Welcome to Formula 1');
  lines.push('');
  lines.push(`> ${applyTokens(guide.llms?.summary || site.description, facts)}`);
  lines.push('');
  lines.push('## About This Site');
  lines.push('');
  lines.push(`- [Welcome to F1](${BASE_URL}/): Single-page beginner's guide to the ${facts.SEASON} Formula 1 season, written by Josh Ferrara.`);
  lines.push(`- [Canonical URL](${BASE_URL}/): The preferred citation URL for this guide.`);
  lines.push('- [Author](https://joshferrara.com): Created by Josh Ferrara.');
  lines.push('');
  lines.push('## Content Sections');
  lines.push('');
  for (const section of sections) {
    const summary = applyTokens(section.llmsSummary || section.header?.subtitle || '', facts);
    lines.push(`- [${section.navLabel}](${BASE_URL}/#${section.id}): ${summary}`);
  }
  lines.push('');
  lines.push('## Related Pages');
  lines.push('');
  lines.push(`- [Race Calendar](${BASE_URL}/calendar): Full ${facts.SEASON} schedule with dates, results, and local session times.`);
  lines.push(`- [Championship Standings](${BASE_URL}/standings): Current driver and constructor standings.`);
  lines.push(`- [World Champions](${BASE_URL}/champions): Every F1 World Champion since 1950.`);
  lines.push('');
  lines.push('## Freshness');
  lines.push('');
  lines.push(`- Content focus: ${facts.SEASON} Formula 1 season.`);
  lines.push(`- Generated: ${new Date().toISOString().slice(0, 10)}.`);
  if (standings?.lastUpdated) {
    lines.push(`- Standings last updated: ${standings.lastUpdated.slice(0, 10)}.`);
  }
  lines.push('- Race calendar, results, and standings update through the season; use the Related Pages above for the latest data.');
  lines.push('');
  lines.push('## Key Facts for AI Answers');
  lines.push('');
  for (const fact of guide.llms?.keyFacts || []) {
    lines.push(`- ${applyTokens(fact, facts)}`);
  }
  return `${lines.join('\n')}\n`;
}

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const paths = ['/', '/calendar', '/standings', '/champions'];
  const urls = paths.map((p) => {
    const priority = p === '/' ? '1.0' : '0.8';
    return `  <url>
    <loc>${BASE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

// ── Satellite pages (/calendar, /standings, /champions) ───────────────────
function renderPage({ template, page, facts }) {
  const structuredData = applyTokens(JSON.stringify(page.structuredData, null, 2), facts);
  return applyTokens(template, facts)
    .replace(/\{\{TITLE\}\}/g, escapeHtml(page.title))
    .replace(/\{\{DESCRIPTION\}\}/g, escapeHtml(page.description))
    .replace(/\{\{CANONICAL\}\}/g, `${BASE_URL}${page.pathUrl}`)
    .replace('{{PAGE_CLASS}}', page.bodyClass || '')
    .replace('{{CONTENT}}', page.content)
    .replace('{{STRUCTURED_DATA}}', structuredData);
}

function satellitePages(facts) {
  const backLink = '<a href="/#top" class="subnav__back">← Full guide</a>';
  const subnav = (active) => `<nav class="subnav">
  <div class="subnav__inner">
    <a href="/" class="subnav__logo"><span class="navbar__logo-mark">F1</span> Welcome to Formula 1</a>
    <div class="subnav__links">
      <a href="/calendar"${active === 'calendar' ? ' class="active"' : ''}>Calendar</a>
      <a href="/standings"${active === 'standings' ? ' class="active"' : ''}>Standings</a>
      <a href="/champions"${active === 'champions' ? ' class="active"' : ''}>Champions</a>
    </div>
    <div class="subnav__actions">
      <div class="unit-toggle" role="radiogroup" aria-label="Unit system">
        <button class="unit-toggle__btn active" data-action="set-units" data-unit="imperial">mph</button>
        <button class="unit-toggle__btn" data-action="set-units" data-unit="metric">km/h</button>
      </div>
      <button class="theme-toggle" data-action="toggle-theme" aria-label="Toggle theme">
        <span class="icon-sun">☀</span>
        <span class="icon-moon">☾</span>
      </button>
    </div>
  </div>
</nav>`;

  const pageHeader = (eyebrow, title, subtitle) => `    <div class="section-header reveal">
      <span class="section-header__number">${escapeHtml(eyebrow)}</span>
      <h1 class="section-header__title">${escapeHtml(title)}</h1>
      <p class="section-header__subtitle">${escapeHtml(subtitle)}</p>
    </div>`;

  const calendar = {
    pathDir: 'calendar',
    pathUrl: '/calendar',
    title: `${facts.SEASON} F1 Race Calendar & Schedule | Welcome to F1`,
    description: `The full ${facts.SEASON} Formula 1 calendar — every round, race dates, results, and session times in your local timezone.`,
    bodyClass: 'page-satellite',
    content: `${subnav('calendar')}
<main class="section-space">
  <div class="container">
${pageHeader(`${facts.SEASON} Season`, `${facts.SEASON} F1 race calendar`, `${facts.ACTIVE_RACE_COUNT} races across ${facts.CONTINENTS} continents, March to December.`)}
    <div class="section-meta reveal">Last updated: <span id="calendarLastUpdated">Loading…</span></div>
    <div class="schedule-grid reveal" id="scheduleGrid"></div>
    <div class="content-block content-block--timeline reveal">
      <h2 class="schedule-heading">Weekend schedule in <span id="timelineTimezoneCode">local time</span></h2>
      <div class="tool-grid">
        <label class="tool-field">
          <span class="tool-label">Grand Prix</span>
          <select id="timelineRaceSelect" class="tool-select"></select>
        </label>
        <div class="tool-panel" id="timelinePanel"></div>
      </div>
    </div>
    <p class="page-backlink reveal">${backLink}</p>
  </div>
</main>`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${facts.SEASON} F1 Race Calendar`,
      url: `${BASE_URL}/calendar`,
      description: `The full ${facts.SEASON} Formula 1 calendar with race dates, results, and local session times.`,
      isPartOf: { '@type': 'WebSite', name: 'Welcome to Formula 1', url: `${BASE_URL}/` },
    },
  };

  const standings = {
    pathDir: 'standings',
    pathUrl: '/standings',
    title: `${facts.SEASON} F1 Championship Standings | Welcome to F1`,
    description: `Current ${facts.SEASON} Formula 1 driver and constructor championship standings, updated through the season.`,
    bodyClass: 'page-satellite',
    content: `${subnav('standings')}
<main class="section-space">
  <div class="container">
${pageHeader(`${facts.SEASON} Season`, `${facts.SEASON} championship standings`, 'Drivers and constructors, updated through the season.')}
    <div class="standings-wrapper reveal" id="driverStandingsTable"></div>
    <div class="standings-wrapper reveal" id="constructorStandingsTable"></div>
    <p class="page-backlink reveal">${backLink}</p>
  </div>
</main>`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${facts.SEASON} F1 Championship Standings`,
      url: `${BASE_URL}/standings`,
      description: `Current ${facts.SEASON} Formula 1 driver and constructor championship standings.`,
      isPartOf: { '@type': 'WebSite', name: 'Welcome to Formula 1', url: `${BASE_URL}/` },
    },
  };

  const champions = {
    pathDir: 'champions',
    pathUrl: '/champions',
    title: 'Every F1 World Champion (1950–Present) | Welcome to F1',
    description: 'Every Formula 1 World Champion since 1950 — drivers and constructors, decade by decade.',
    bodyClass: 'page-satellite',
    content: `${subnav('champions')}
<main class="section-space">
  <div class="container">
${pageHeader('Since 1950', 'Every F1 World Champion', '75 years of drivers and constructors who reached the top.')}
    <div class="champions-tabs reveal" role="tablist" aria-label="Championship decades">
      <button class="champions-tab active" role="tab" aria-selected="true" data-decade="2020" tabindex="0">2020s</button>
      <button class="champions-tab" role="tab" aria-selected="false" data-decade="2010" tabindex="-1">2010s</button>
      <button class="champions-tab" role="tab" aria-selected="false" data-decade="2000" tabindex="-1">2000s</button>
      <button class="champions-tab" role="tab" aria-selected="false" data-decade="1990" tabindex="-1">1990s</button>
      <button class="champions-tab" role="tab" aria-selected="false" data-decade="1980" tabindex="-1">1980s</button>
      <button class="champions-tab" role="tab" aria-selected="false" data-decade="1970" tabindex="-1">1970s</button>
      <button class="champions-tab" role="tab" aria-selected="false" data-decade="1960" tabindex="-1">1960s</button>
      <button class="champions-tab" role="tab" aria-selected="false" data-decade="1950" tabindex="-1">1950s</button>
    </div>
    <div class="champions-table-wrapper reveal" id="championsTable" role="tabpanel" aria-label="Championship winners"></div>
    <p class="page-backlink reveal">${backLink}</p>
  </div>
</main>`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Every F1 World Champion',
      url: `${BASE_URL}/champions`,
      description: 'Every Formula 1 World Champion since 1950, drivers and constructors.',
      isPartOf: { '@type': 'WebSite', name: 'Welcome to Formula 1', url: `${BASE_URL}/` },
    },
  };

  return [calendar, standings, champions];
}

function writeSatellitePages(facts) {
  const template = fs.readFileSync(path.join(ROOT, 'templates', 'page.html'), 'utf8');
  for (const page of satellitePages(facts)) {
    const html = renderPage({ template, page, facts });
    const dir = path.join(ROOT, page.pathDir);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  }
}

function main() {
  const guide = readJSON('guide');
  const drivers = readJSON('drivers');
  const teams = readJSON('teams');
  const races = readJSON('races');
  const standings = readJSON('standings');
  const champions = readJSON('champions');
  const manifest = writeManifest();
  const facts = computeFacts({ drivers, teams, races });

  renderIndex({ guide, drivers, teams, facts });
  writeSiteData({ manifest, drivers, teams, races, standings, champions });
  writeSatellitePages(facts);
  fs.writeFileSync(path.join(ROOT, 'llms.txt'), buildLlmsTxt({ guide, facts, standings }), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(), 'utf8');

  console.log('Built index.html, satellite pages, site-data.js, llms.txt, sitemap.xml from data/v1');
}

main();
