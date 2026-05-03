#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SCHEDULE_URL = 'https://api.jolpi.ca/ergast/f1/2026.json';

// Maps the field name as used in races-data.js to the corresponding key
// (or list of keys, for renamed sessions) on each Race object from Ergast.
const SESSION_FIELDS = [
  { field: 'fp1',              apiKeys: ['FirstPractice'] },
  { field: 'fp2',              apiKeys: ['SecondPractice'] },
  { field: 'fp3',              apiKeys: ['ThirdPractice'] },
  { field: 'qualifying',       apiKeys: ['Qualifying'] },
  { field: 'sprintQualifying', apiKeys: ['SprintQualifying', 'SprintShootout'] },
  { field: 'sprint',           apiKeys: ['Sprint'] },
];

const ALL_TIME_FIELDS = [...SESSION_FIELDS.map(s => s.field), 'race'];

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
}

// Ergast returns "HH:MM:SSZ"; the file uses "HH:MMZ" — strip seconds.
function formatISO(date, time) {
  if (!date || !time) return null;
  const m = String(time).match(/^(\d{2}:\d{2})/);
  if (!m) return null;
  return `${date}T${m[1]}Z`;
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

// Replaces a single `field: 'value'` pair within one line of races-data.js.
// Only touches the field if it already exists on the line — never adds new
// fields, so a sprint/regular weekend reclassification stays a manual change.
function replaceFieldInLine(line, field, newValue) {
  const re = new RegExp(`(\\b${field}:\\s*')([^']*)(')`);
  let oldValue = null;
  const updated = line.replace(re, (_, p1, p2, p3) => {
    oldValue = p2;
    return `${p1}${newValue}${p3}`;
  });
  return { line: updated, oldValue, changed: oldValue !== null && oldValue !== newValue };
}

// Extracts `session` and `offsetMinutes` from a `raceNote: { ... }` block on
// the line, if present. Used to apply a manual offset on top of the API time
// when the FIA has changed a session but Ergast hasn't published it yet.
function extractRaceNote(line) {
  const block = line.match(/raceNote:\s*\{([^}]*)\}/);
  if (!block) return null;
  const inner = block[1];
  const sessionMatch = inner.match(/\bsession:\s*'([^']*)'/);
  const offsetMatch = inner.match(/\boffsetMinutes:\s*(-?\d+)/);
  return {
    session: sessionMatch ? sessionMatch[1] : 'race',
    offsetMinutes: offsetMatch ? parseInt(offsetMatch[1], 10) : 0,
  };
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

async function main() {
  const filePath = path.join(__dirname, '..', 'races-data.js');
  if (!fs.existsSync(filePath)) {
    console.error(`Could not find ${filePath}`);
    process.exit(1);
  }

  let raceMap;
  try {
    console.log('Fetching race schedule...');
    const data = await fetchJSON(SCHEDULE_URL);
    const races = data?.MRData?.RaceTable?.Races || [];
    if (!races.length) {
      console.warn('WARNING: API returned no races. Leaving races-data.js untouched.');
      return;
    }
    raceMap = buildRaceMap(races);
    console.log(`  Found ${raceMap.size} circuits in API`);
  } catch (err) {
    console.warn('WARNING: Could not fetch schedule:', err.message);
    console.warn('  Leaving races-data.js untouched.');
    return;
  }

  const original = fs.readFileSync(filePath, 'utf-8');
  const lines = original.split('\n');
  let totalChanges = 0;

  const updated = lines.map(line => {
    const m = line.match(/\bcircuitId:\s*'([^']+)'/);
    if (!m) return line;
    const circuitId = m[1];
    const apiSessions = raceMap.get(circuitId);
    if (!apiSessions) return line;

    const note = extractRaceNote(line);
    let cur = line;
    for (const field of ALL_TIME_FIELDS) {
      const apiValue = apiSessions[field];
      if (!apiValue) continue;
      let newValue = apiValue;
      let offsetSuffix = '';
      if (note && note.offsetMinutes && note.session === field) {
        newValue = applyOffset(apiValue, note.offsetMinutes);
        offsetSuffix = ` (API ${apiValue} ${note.offsetMinutes >= 0 ? '+' : ''}${note.offsetMinutes}m)`;
      }
      const result = replaceFieldInLine(cur, field, newValue);
      if (result.changed) {
        console.log(`  ${circuitId} ${field}: ${result.oldValue} -> ${newValue}${offsetSuffix}`);
        totalChanges++;
      }
      cur = result.line;
    }
    return cur;
  });

  if (totalChanges === 0) {
    console.log('No session times changed. Leaving races-data.js unchanged.');
    return;
  }

  fs.writeFileSync(filePath, updated.join('\n'), 'utf-8');
  console.log(`Successfully updated ${totalChanges} session time(s) in races-data.js`);
}

main();
