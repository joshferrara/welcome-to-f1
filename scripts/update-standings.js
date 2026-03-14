#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DRIVER_URL = 'http://api.jolpi.ca/ergast/f1/2026/driverStandings.json';
const CONSTRUCTOR_URL = 'http://api.jolpi.ca/ergast/f1/2026/constructorStandings.json';

const CONSTRUCTOR_NAME_MAP = {
  'red_bull': 'Red Bull Racing',
  'mclaren': 'McLaren',
  'ferrari': 'Scuderia Ferrari',
  'mercedes': 'Mercedes-AMG',
  'aston_martin': 'Aston Martin',
  'alpine': 'Alpine',
  'williams': 'Williams',
  'rb': 'Racing Bulls',
  'haas': 'Haas',
  'sauber': 'Audi',
  'kick_sauber': 'Audi',
  'audi': 'Audi',
  'cadillac': 'Cadillac',
};

const TEAM_NAME_MAP = {
  'Red Bull': 'Red Bull Racing',
  'McLaren': 'McLaren',
  'Ferrari': 'Scuderia Ferrari',
  'Mercedes': 'Mercedes-AMG',
  'Aston Martin': 'Aston Martin',
  'Alpine F1 Team': 'Alpine',
  'Williams': 'Williams',
  'RB F1 Team': 'Racing Bulls',
  'Racing Bulls': 'Racing Bulls',
  'Haas F1 Team': 'Haas',
  'Kick Sauber': 'Audi',
  'Sauber': 'Audi',
  'Audi': 'Audi',
  'Cadillac': 'Cadillac',
};

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
}

function mapTeamName(apiName) {
  return TEAM_NAME_MAP[apiName] || apiName;
}

function mapConstructorName(constructorId, apiFallback) {
  return CONSTRUCTOR_NAME_MAP[constructorId] || apiFallback;
}

async function main() {
  const htmlPath = path.join(__dirname, '..', 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf-8');

  const startMarker = '<!-- STANDINGS_DATA_START -->';
  const endMarker = '<!-- STANDINGS_DATA_END -->';

  if (!html.includes(startMarker) || !html.includes(endMarker)) {
    console.error('Could not find STANDINGS_DATA markers in index.html');
    process.exit(1);
  }

  let driverStandings = [];
  let constructorStandings = [];

  try {
    console.log('Fetching driver standings...');
    const driverData = await fetchJSON(DRIVER_URL);
    const driverList = driverData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];

    driverStandings = driverList.map(d => ({
      pos: parseInt(d.position, 10) || null,
      code: d.Driver.code,
      name: `${d.Driver.givenName} ${d.Driver.familyName}`,
      team: mapTeamName(d.Constructors?.[0]?.name || ''),
      points: parseFloat(d.points),
      wins: parseInt(d.wins, 10),
    }));

    // Assign positions to unclassified drivers (API returns "-" for those without a position)
    let nextDriverPos = driverStandings.filter(d => d.pos !== null).length + 1;
    driverStandings.forEach(d => {
      if (d.pos === null) d.pos = nextDriverPos++;
    });

    console.log(`  Found ${driverStandings.length} drivers`);
  } catch (err) {
    console.warn('WARNING: Could not fetch driver standings:', err.message);
    console.warn('  Leaving existing data untouched.');
  }

  try {
    console.log('Fetching constructor standings...');
    const constructorData = await fetchJSON(CONSTRUCTOR_URL);
    const constructorList = constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];

    constructorStandings = constructorList.map(c => ({
      pos: parseInt(c.position, 10) || null,
      name: mapConstructorName(c.Constructor.constructorId, c.Constructor.name),
      points: parseFloat(c.points),
      wins: parseInt(c.wins, 10),
    }));

    // Assign positions to unclassified constructors (API returns "-" for those without a position)
    let nextConstructorPos = constructorStandings.filter(c => c.pos !== null).length + 1;
    constructorStandings.forEach(c => {
      if (c.pos === null) c.pos = nextConstructorPos++;
    });

    console.log(`  Found ${constructorStandings.length} constructors`);
  } catch (err) {
    console.warn('WARNING: Could not fetch constructor standings:', err.message);
    console.warn('  Leaving existing data untouched.');
  }

  if (driverStandings.length === 0 && constructorStandings.length === 0) {
    console.log('No data fetched. Leaving index.html unchanged.');
    return;
  }

  const now = new Date().toISOString();
  const dataBlock = `${startMarker}
const driverStandings = ${JSON.stringify(driverStandings, null, 2)};
const constructorStandings = ${JSON.stringify(constructorStandings, null, 2)};
const standingsLastUpdated = "${now}";
${endMarker}`;

  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker) + endMarker.length;
  html = html.slice(0, startIdx) + dataBlock + html.slice(endIdx);

  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log('Successfully updated standings in index.html');
}

main();
