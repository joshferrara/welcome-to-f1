#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DRIVER_URL = 'https://api.jolpi.ca/ergast/f1/2026/driverStandings.json';
const CONSTRUCTOR_URL = 'https://api.jolpi.ca/ergast/f1/2026/constructorStandings.json';
const DATA_PATH = path.join(__dirname, '..', 'data', 'v1', 'standings.json');

const CONSTRUCTOR_NAME_MAP = {
  red_bull: 'Red Bull Racing',
  mclaren: 'McLaren',
  ferrari: 'Scuderia Ferrari',
  mercedes: 'Mercedes-AMG',
  aston_martin: 'Aston Martin',
  alpine: 'Alpine',
  williams: 'Williams',
  rb: 'Racing Bulls',
  haas: 'Haas',
  sauber: 'Audi',
  kick_sauber: 'Audi',
  audi: 'Audi',
  cadillac: 'Cadillac',
};

const TEAM_NAME_MAP = {
  'Red Bull': 'Red Bull Racing',
  McLaren: 'McLaren',
  Ferrari: 'Scuderia Ferrari',
  Mercedes: 'Mercedes-AMG',
  'Aston Martin': 'Aston Martin',
  'Alpine F1 Team': 'Alpine',
  Williams: 'Williams',
  'RB F1 Team': 'Racing Bulls',
  'Racing Bulls': 'Racing Bulls',
  'Haas F1 Team': 'Haas',
  'Kick Sauber': 'Audi',
  Sauber: 'Audi',
  Audi: 'Audi',
  Cadillac: 'Cadillac',
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

async function fetchDriverStandings() {
  console.log('Fetching driver standings...');
  const driverData = await fetchJSON(DRIVER_URL);
  const driverList = driverData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];

  const driverStandings = driverList.map((driver) => ({
    pos: parseInt(driver.position, 10) || null,
    code: driver.Driver.code,
    name: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
    team: mapTeamName(driver.Constructors?.[0]?.name || ''),
    points: parseFloat(driver.points),
    wins: parseInt(driver.wins, 10),
  }));

  let nextDriverPos = driverStandings.filter((driver) => driver.pos !== null).length + 1;
  driverStandings.forEach((driver) => {
    if (driver.pos === null) driver.pos = nextDriverPos++;
  });

  console.log(`  Found ${driverStandings.length} drivers`);
  return driverStandings;
}

async function fetchConstructorStandings() {
  console.log('Fetching constructor standings...');
  const constructorData = await fetchJSON(CONSTRUCTOR_URL);
  const constructorList = constructorData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];

  const constructorStandings = constructorList.map((constructor) => ({
    pos: parseInt(constructor.position, 10) || null,
    name: mapConstructorName(constructor.Constructor.constructorId, constructor.Constructor.name),
    points: parseFloat(constructor.points),
    wins: parseInt(constructor.wins, 10),
  }));

  let nextConstructorPos = constructorStandings.filter((constructor) => constructor.pos !== null).length + 1;
  constructorStandings.forEach((constructor) => {
    if (constructor.pos === null) constructor.pos = nextConstructorPos++;
  });

  console.log(`  Found ${constructorStandings.length} constructors`);
  return constructorStandings;
}

async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Could not find ${DATA_PATH}`);
    process.exit(1);
  }

  const current = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  let drivers = current.drivers || [];
  let constructors = current.constructors || [];
  let changed = false;

  try {
    drivers = await fetchDriverStandings();
    changed = true;
  } catch (err) {
    console.warn('WARNING: Could not fetch driver standings:', err.message);
    console.warn('  Keeping existing driver standings.');
  }

  try {
    constructors = await fetchConstructorStandings();
    changed = true;
  } catch (err) {
    console.warn('WARNING: Could not fetch constructor standings:', err.message);
    console.warn('  Keeping existing constructor standings.');
  }

  if (!changed) {
    console.log('No standings data fetched. Leaving data/v1/standings.json unchanged.');
    return;
  }

  const next = {
    schemaVersion: current.schemaVersion || 1,
    season: current.season || 2026,
    lastUpdated: new Date().toISOString(),
    drivers,
    constructors,
  };

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  console.log('Successfully updated data/v1/standings.json');
}

main();
