#!/usr/bin/env node

// Runs every data-import script in sequence. Wired in as the Cloudflare
// Pages Build command so adding a new updater here requires no dashboard change.
//
// Each script is fail-soft on API errors (logs a warning, leaves the file
// untouched). A non-zero exit from any script flags a real failure (e.g.
// file-write error) and bubbles up to fail the build, but every script still
// runs so independent updates aren't blocked by an earlier one.

const { spawnSync } = require('child_process');
const path = require('path');

const scripts = [
  'update-standings.js',
  'update-races.js',
];

let exitCode = 0;

for (const name of scripts) {
  console.log(`\n--- Running ${name} ---`);
  const result = spawnSync('node', [path.join(__dirname, name)], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`${name} exited with code ${result.status}`);
    if (exitCode === 0) exitCode = result.status || 1;
  }
}

process.exit(exitCode);
