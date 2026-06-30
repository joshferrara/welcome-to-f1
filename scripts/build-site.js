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

function renderIndex({ guide, drivers, teams }) {
  const template = fs.readFileSync(path.join(ROOT, 'templates', 'index.html'), 'utf8');
  const bodySource = guide.bodyMarkdown
    .replace('{{DRIVER_GRID}}', renderDriverGrid(drivers.drivers))
    .replace('{{TEAM_GRID}}', renderTeamGrid(teams.teams));
  const body = bodySource.trim();
  const structuredData = JSON.stringify(guide.structuredData, null, 2);
  const html = template
    .replace('{{BODY}}', body)
    .replace('{{STRUCTURED_DATA}}', structuredData);
  fs.writeFileSync(path.join(ROOT, 'index.html'), html, 'utf8');
}

function main() {
  const guide = readJSON('guide');
  const drivers = readJSON('drivers');
  const teams = readJSON('teams');
  const races = readJSON('races');
  const standings = readJSON('standings');
  const champions = readJSON('champions');
  const manifest = writeManifest();

  renderIndex({ guide, drivers, teams });
  writeSiteData({ manifest, drivers, teams, races, standings, champions });

  console.log('Built index.html and site-data.js from data/v1');
}

main();
