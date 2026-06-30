#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SCHEDULE_URL = 'https://api.jolpi.ca/ergast/f1/2026.json';
const DATA_PATH = path.join(__dirname, '..', 'data', 'v1', 'races.json');

// Maps the field name as used in data/v1/races.json to the corresponding key
// (or list of keys, for renamed sessions) on each Race object from Ergast.
const SESSION_FIELDS = [
  { field: 'fp1', apiKeys: ['FirstPractice'] },
  { field: 'fp2', apiKeys: ['SecondPractice'] },
  { field: 'fp3', apiKeys: ['ThirdPractice'] },
  { field: 'qualifying', apiKeys: ['Qualifying'] },
  { field: 'sprintQualifying', apiKeys: ['SprintQualifying', 'SprintShootout'] },
  { field: 'sprint', apiKeys: ['Sprint'] },
];

const ALL_TIME_FIELDS = [...SESSION_FIELDS.map((session) => session.field), 'race'];

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
}

// Ergast returns "HH:MM:SSZ"; the site uses "HH:MMZ" — strip seconds.
function formatISO(date, time) {
  if (!date || !time) return null;
  const match = String(time).match(/^(\d{2}:\d{2})/);
  if (!match) return null;
  return `${date}T${match[1]}Z`;
}

function getSessionISO(race, apiKeys) {
  for (const key of apiKeys) {
    const session = race[key];
    if (session?.date && session?.time) {
      const iso = formatISO(session.date, session.time);
      if (iso) return iso;
    }
  }
  return null;
}

function buildRaceMap(races) {
  const map = new Map();
  for (const race of races) {
    const circuitId = race.Circuit?.circuitId;
    if (!circuitId) continue;
    const sessions = {};
    for (const def of SESSION_FIELDS) {
      const iso = getSessionISO(race, def.apiKeys);
      if (iso) sessions[def.field] = iso;
    }
    const raceISO = formatISO(race.date, race.time);
    if (raceISO) sessions.race = raceISO;
    map.set(circuitId, sessions);
  }
  return map;
}

function applyOffset(iso, minutes) {
  const d = new Date(iso);
  d.setUTCMinutes(d.getUTCMinutes() + minutes);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${min}Z`;
}

function updateRaceTimes(calendar, raceMap) {
  let totalChanges = 0;

  for (const race of calendar.races || []) {
    if (race.type || !race.circuitId) continue;
    const apiSessions = raceMap.get(race.circuitId);
    if (!apiSessions) continue;

    const note = race.raceNote || null;
    const noteSession = note && (note.session || 'race');

    for (const field of ALL_TIME_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(race, field)) continue;
      const apiValue = apiSessions[field];
      if (!apiValue) continue;

      let newValue = apiValue;
      let offsetSuffix = '';
      if (note && note.offsetMinutes && noteSession === field) {
        newValue = applyOffset(apiValue, note.offsetMinutes);
        offsetSuffix = ` (API ${apiValue} ${note.offsetMinutes >= 0 ? '+' : ''}${note.offsetMinutes}m)`;
      }

      if (race[field] !== newValue) {
        console.log(`  ${race.circuitId} ${field}: ${race[field]} -> ${newValue}${offsetSuffix}`);
        race[field] = newValue;
        totalChanges++;
      }
    }
  }

  return totalChanges;
}

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Could not find ${DATA_PATH}`);
    process.exit(1);
  }

  let raceMap;
  try {
    console.log('Fetching race schedule...');
    const data = await fetchJSON(SCHEDULE_URL);
    const races = data?.MRData?.RaceTable?.Races || [];
    if (!races.length) {
      console.warn('WARNING: API returned no races. Leaving data/v1/races.json untouched.');
      return;
    }
    raceMap = buildRaceMap(races);
    console.log(`  Found ${raceMap.size} circuits in API`);
  } catch (err) {
    console.warn('WARNING: Could not fetch schedule:', err.message);
    console.warn('  Leaving data/v1/races.json untouched.');
    return;
  }

  const calendar = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const totalChanges = updateRaceTimes(calendar, raceMap);

  if (totalChanges === 0) {
    console.log('No session times changed. Leaving data/v1/races.json unchanged.');
    return;
  }

  calendar.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(calendar, null, 2)}\n`, 'utf8');
  console.log(`Successfully updated ${totalChanges} session time(s) in data/v1/races.json`);
}

main();
