#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'v1');
const REQUIRED_FILES = ['manifest', 'guide', 'drivers', 'teams', 'races', 'standings', 'champions'];
const SESSION_FIELDS = ['fp1', 'fp2', 'fp3', 'sprintQualifying', 'sprint', 'qualifying', 'race'];

const errors = [];

function fail(message) {
  errors.push(message);
}

function readJSON(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) {
    fail(`Missing data file: data/v1/${name}.json`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON in data/v1/${name}.json: ${error.message}`);
    return null;
  }
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function assertArray(value, label) {
  if (!Array.isArray(value)) fail(`${label} must be an array`);
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') fail(`${label} must be a non-empty string`);
}

function unique(items, key, label) {
  const seen = new Set();
  for (const item of items || []) {
    const value = item && item[key];
    if (!value) {
      fail(`${label} entry missing ${key}`);
      continue;
    }
    if (seen.has(value)) fail(`${label} has duplicate ${key}: ${value}`);
    seen.add(value);
  }
  return seen;
}

function assertRootAsset(value, label) {
  if (!value) return;
  if (/^(https?:)?\/\//.test(value)) return;
  if (!value.startsWith('/')) {
    fail(`${label} must be root-relative or absolute URL: ${value}`);
    return;
  }
  const file = path.join(ROOT, value.replace(/^\/+/, ''));
  if (!fs.existsSync(file)) fail(`${label} points to missing asset: ${value}`);
}

function assertISODate(value, label) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(value)) {
    fail(`${label} must be UTC ISO minute format like 2026-03-08T04:00Z`);
    return;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) fail(`${label} is not a valid date: ${value}`);
}

function validateManifest(manifest) {
  if (!manifest) return;
  assertString(manifest.baseUrl, 'manifest.baseUrl');
  if (!isObject(manifest.resources)) fail('manifest.resources must be an object');
  for (const name of REQUIRED_FILES.filter((item) => item !== 'manifest')) {
    const expected = `/data/v1/${name}.json`;
    if (manifest.resources?.[name] !== expected) {
      fail(`manifest.resources.${name} must be ${expected}`);
    }
    if (!fs.existsSync(path.join(ROOT, expected))) {
      fail(`manifest resource does not exist: ${expected}`);
    }
  }
}

function validateGuide(guide) {
  if (!guide) return;
  assertString(guide.site?.title, 'guide.site.title');
  assertString(guide.site?.description, 'guide.site.description');
  assertString(guide.bodyMarkdown, 'guide.bodyMarkdown');
  assertArray(guide.navigation, 'guide.navigation');
  assertArray(guide.sections, 'guide.sections');
  if (!guide.bodyMarkdown.includes('{{DRIVER_GRID}}')) fail('guide.bodyMarkdown must include {{DRIVER_GRID}}');
  if (!guide.bodyMarkdown.includes('{{TEAM_GRID}}')) fail('guide.bodyMarkdown must include {{TEAM_GRID}}');

  const attrPattern = /\b(?:src|href|data-audio-src)="([^"]+)"/g;
  let match;
  while ((match = attrPattern.exec(guide.bodyMarkdown))) {
    const value = match[1];
    if (/^(https?:)?\/\//.test(value) || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:')) {
      continue;
    }
    assertRootAsset(value, `guide asset reference`);
  }
}

function validateDrivers(driversData) {
  if (!driversData) return new Set();
  assertArray(driversData.drivers, 'drivers.drivers');
  const ids = unique(driversData.drivers, 'id', 'drivers');
  unique(driversData.drivers, 'code', 'drivers');
  for (const driver of driversData.drivers || []) {
    assertString(driver.name, `drivers.${driver.id}.name`);
    assertString(driver.teamId, `drivers.${driver.id}.teamId`);
    assertString(driver.number, `drivers.${driver.id}.number`);
    assertRootAsset(driver.image, `drivers.${driver.id}.image`);
  }
  return ids;
}

function validateTeams(teamsData, driverIds) {
  if (!teamsData) return new Set();
  assertArray(teamsData.teams, 'teams.teams');
  const teamIds = unique(teamsData.teams, 'id', 'teams');
  for (const team of teamsData.teams || []) {
    assertString(team.name, `teams.${team.id}.name`);
    assertString(team.color, `teams.${team.id}.color`);
    assertArray(team.driverIds, `teams.${team.id}.driverIds`);
    for (const driverId of team.driverIds || []) {
      if (!driverIds.has(driverId)) fail(`teams.${team.id}.driverIds references unknown driver: ${driverId}`);
    }
  }
  return teamIds;
}

function validateRaces(racesData, driverCodes) {
  if (!racesData) return;
  assertArray(racesData.races, 'races.races');
  const rounds = new Set();
  for (const item of racesData.races || []) {
    if (item.type === 'break') {
      assertString(item.label, 'race break label');
      assertString(item.detail, `race break ${item.label}.detail`);
      continue;
    }
    if (rounds.has(item.round)) fail(`races has duplicate round: ${item.round}`);
    rounds.add(item.round);
    assertString(item.name, `races.round${item.round}.name`);
    assertString(item.location, `races.round${item.round}.location`);
    assertString(item.circuitId, `races.round${item.round}.circuitId`);
    for (const field of SESSION_FIELDS) {
      if (item[field]) assertISODate(item[field], `races.round${item.round}.${field}`);
    }
    if (item.results) {
      if (!Array.isArray(item.results) || item.results.length !== 3) {
        fail(`races.round${item.round}.results must contain three driver codes`);
      } else {
        for (const code of item.results) {
          if (!driverCodes.has(code)) fail(`races.round${item.round}.results references unknown driver code: ${code}`);
        }
      }
    }
  }
}

function validateStandings(standings, driverCodes, teamNames) {
  if (!standings) return;
  assertArray(standings.drivers, 'standings.drivers');
  assertArray(standings.constructors, 'standings.constructors');
  for (const driver of standings.drivers || []) {
    if (!driverCodes.has(driver.code)) fail(`standings driver code does not exist in drivers.json: ${driver.code}`);
  }
  for (const constructor of standings.constructors || []) {
    if (!teamNames.has(constructor.name)) fail(`standings constructor does not exist in teams.json: ${constructor.name}`);
  }
}

function validateChampions(champions) {
  if (!champions) return;
  assertArray(champions.decades, 'champions.decades');
  assertArray(champions.champions, 'champions.champions');
  for (const champion of champions.champions || []) {
    if (!Number.isInteger(champion.year)) fail(`champions entry has invalid year: ${champion.year}`);
    assertString(champion.driver, `champions.${champion.year}.driver`);
    assertString(champion.team, `champions.${champion.year}.team`);
  }
}

function main() {
  const data = Object.fromEntries(REQUIRED_FILES.map((name) => [name, readJSON(name)]));
  validateManifest(data.manifest);
  validateGuide(data.guide);
  const driverIds = validateDrivers(data.drivers);
  const driverCodes = new Set((data.drivers?.drivers || []).map((driver) => driver.code).filter(Boolean));
  const teamIds = validateTeams(data.teams, driverIds);
  const teamNames = new Set((data.teams?.teams || []).map((team) => team.name));
  validateRaces(data.races, driverCodes);
  validateStandings(data.standings, driverCodes, teamNames);
  validateChampions(data.champions);

  for (const driver of data.drivers?.drivers || []) {
    if (!teamIds.has(driver.teamId)) fail(`drivers.${driver.id}.teamId references unknown team: ${driver.teamId}`);
  }

  if (errors.length) {
    console.error(`Data validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log('Data validation passed');
}

main();
