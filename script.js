// ── Championship Standings Data ──
// (Updated at build time by scripts/update-standings.js)
// STANDINGS_DATA_START
const driverStandings = [
  {
    "pos": 1,
    "code": "RUS",
    "name": "George Russell",
    "team": "Mercedes-AMG",
    "points": 33,
    "wins": 1
  },
  {
    "pos": 2,
    "code": "ANT",
    "name": "Andrea Kimi Antonelli",
    "team": "Mercedes-AMG",
    "points": 22,
    "wins": 0
  },
  {
    "pos": 3,
    "code": "LEC",
    "name": "Charles Leclerc",
    "team": "Scuderia Ferrari",
    "points": 22,
    "wins": 0
  },
  {
    "pos": 4,
    "code": "HAM",
    "name": "Lewis Hamilton",
    "team": "Scuderia Ferrari",
    "points": 18,
    "wins": 0
  },
  {
    "pos": 5,
    "code": "NOR",
    "name": "Lando Norris",
    "team": "McLaren",
    "points": 15,
    "wins": 0
  },
  {
    "pos": 6,
    "code": "VER",
    "name": "Max Verstappen",
    "team": "Red Bull Racing",
    "points": 8,
    "wins": 0
  },
  {
    "pos": 7,
    "code": "BEA",
    "name": "Oliver Bearman",
    "team": "Haas",
    "points": 7,
    "wins": 0
  },
  {
    "pos": 8,
    "code": "LIN",
    "name": "Arvid Lindblad",
    "team": "Racing Bulls",
    "points": 4,
    "wins": 0
  },
  {
    "pos": 10,
    "code": "BOR",
    "name": "Gabriel Bortoleto",
    "team": "Audi",
    "points": 2,
    "wins": 0
  },
  {
    "pos": 11,
    "code": "LAW",
    "name": "Liam Lawson",
    "team": "Racing Bulls",
    "points": 2,
    "wins": 0
  },
  {
    "pos": 12,
    "code": "GAS",
    "name": "Pierre Gasly",
    "team": "Alpine",
    "points": 1,
    "wins": 0
  },
  {
    "pos": 13,
    "code": "OCO",
    "name": "Esteban Ocon",
    "team": "Haas",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 14,
    "code": "ALB",
    "name": "Alexander Albon",
    "team": "Williams",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 15,
    "code": "COL",
    "name": "Franco Colapinto",
    "team": "Alpine",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 16,
    "code": "SAI",
    "name": "Carlos Sainz",
    "team": "Williams",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 17,
    "code": "PER",
    "name": "Sergio Pérez",
    "team": "Cadillac F1 Team",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 17,
    "code": "PIA",
    "name": "Oscar Piastri",
    "team": "McLaren",
    "points": 3,
    "wins": 0
  },
  {
    "pos": 18,
    "code": "STR",
    "name": "Lance Stroll",
    "team": "Aston Martin",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 19,
    "code": "ALO",
    "name": "Fernando Alonso",
    "team": "Aston Martin",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 20,
    "code": "BOT",
    "name": "Valtteri Bottas",
    "team": "Cadillac F1 Team",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 21,
    "code": "HAD",
    "name": "Isack Hadjar",
    "team": "Red Bull Racing",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 22,
    "code": "HUL",
    "name": "Nico Hülkenberg",
    "team": "Audi",
    "points": 0,
    "wins": 0
  }
];
const constructorStandings = [
  {
    "pos": 1,
    "name": "Mercedes-AMG",
    "points": 55,
    "wins": 1
  },
  {
    "pos": 2,
    "name": "Scuderia Ferrari",
    "points": 40,
    "wins": 0
  },
  {
    "pos": 3,
    "name": "McLaren",
    "points": 18,
    "wins": 0
  },
  {
    "pos": 4,
    "name": "Red Bull Racing",
    "points": 8,
    "wins": 0
  },
  {
    "pos": 5,
    "name": "Haas",
    "points": 7,
    "wins": 0
  },
  {
    "pos": 6,
    "name": "Racing Bulls",
    "points": 6,
    "wins": 0
  },
  {
    "pos": 7,
    "name": "Audi",
    "points": 2,
    "wins": 0
  },
  {
    "pos": 8,
    "name": "Alpine",
    "points": 1,
    "wins": 0
  },
  {
    "pos": 9,
    "name": "Williams",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 10,
    "name": "Cadillac",
    "points": 0,
    "wins": 0
  },
  {
    "pos": 11,
    "name": "Aston Martin",
    "points": 0,
    "wins": 0
  }
];
const standingsLastUpdated = "2026-03-14T15:45:24.261Z";
// STANDINGS_DATA_END

// ── Theme Toggle ──
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('f1-guide-theme', next);
}

// Restore saved theme
(function() {
  const saved = localStorage.getItem('f1-guide-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

// ── Unit Toggle ──
function setUnits(unit) {
  document.documentElement.setAttribute('data-units', unit);
  document.querySelectorAll('.unit').forEach(el => {
    el.textContent = el.dataset[unit];
  });
  document.querySelectorAll('.unit-toggle__btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === unit);
  });
  localStorage.setItem('f1-units', unit);
}

// Restore saved units
(function() {
  const saved = localStorage.getItem('f1-units');
  if (saved) setUnits(saved);
})();

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});

// ── Scroll reveal ──
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ── Hero lights animation ──
(function animateLights() {
  const lights = document.querySelectorAll('.hero__light');
  let i = 0;

  function lightUp() {
    if (i < lights.length) {
      lights[i].classList.add('on');
      i++;
      setTimeout(lightUp, 600);
    } else {
      setTimeout(() => {
        lights.forEach(l => l.classList.remove('on'));
        i = 0;
        setTimeout(lightUp, 2000);
      }, 1500);
    }
  }

  setTimeout(lightUp, 800);
})();

// ── Pit stop timer animation ──
const pitstopTimer = document.getElementById('pitstopTimer');
const pitstopObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animatePitstop();
      pitstopObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

pitstopObserver.observe(pitstopTimer);

function animatePitstop() {
  const target = 1.80;
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (eased * target).toFixed(2);
    pitstopTimer.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      pitstopTimer.textContent = '1.80';
    }
  }

  requestAnimationFrame(update);
}

// ── Engine audio player ──
const engineRows = Array.from(document.querySelectorAll('.pu-supplier--interactive'));
const engineAudioPlayer = document.getElementById('engineAudioPlayer');
let activeEngineId = null;

// Haptic feedback for Honda engine sound
// iOS: uses a hidden <input type="checkbox" switch> clicked every rAF frame.
// Full 60fps clicking produces the smoothest sustained haptic buzz.
// The element is recreated every ~1s (60 frames) to reset any iOS
// throttling that causes the haptic to stop after a few seconds.
// Android: uses navigator.vibrate() with a long repeating pattern.
let hapticRunning = false;
let hapticLabel = null;
let hapticFrameCount = 0;

function createHapticEl() {
  if (hapticLabel) hapticLabel.remove();
  const label = document.createElement('label');
  label.ariaHidden = 'true';
  label.style.position = 'fixed';
  label.style.left = '-9999px';
  label.style.top = '-9999px';
  label.style.opacity = '0';
  label.style.pointerEvents = 'none';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  label.appendChild(input);
  document.body.appendChild(label);
  hapticLabel = label;
  hapticFrameCount = 0;
}

function hapticLoop() {
  if (!hapticRunning) return;
  hapticFrameCount++;
  // Recreate element every ~1s to reset any iOS throttling
  if (hapticFrameCount >= 60) {
    createHapticEl();
  }
  if (hapticLabel) hapticLabel.click();
  requestAnimationFrame(hapticLoop);
}

function startHondaHaptic() {
  if (hapticRunning) return;
  hapticRunning = true;

  // Android: long repeating vibration pattern covering up to 60s
  if (typeof navigator.vibrate === 'function') {
    const unit = [80, 60, 50, 80, 40];
    const reps = Math.ceil(60000 / 310);
    const pattern = [];
    for (let i = 0; i < reps; i++) {
      pattern.push(...unit);
    }
    navigator.vibrate(pattern);
  }

  // iOS: click hidden switch checkbox every frame for smooth haptic
  createHapticEl();
  requestAnimationFrame(hapticLoop);
}

function stopHondaHaptic() {
  hapticRunning = false;
  if (hapticLabel) {
    hapticLabel.remove();
    hapticLabel = null;
  }
  if (typeof navigator.vibrate === 'function') navigator.vibrate(0);
}

function updateEngineRows() {
  const isPlaying = engineAudioPlayer ? !engineAudioPlayer.paused : false;
  const hondaIsPlaying = activeEngineId === 'honda' && isPlaying;

  if (hondaIsPlaying) {
    startHondaHaptic();
  } else {
    stopHondaHaptic();
  }

  engineRows.forEach((row) => {
    const rowEngineId = row.dataset.engineId;
    const rowEngineName = row.dataset.engineName;
    const rowIsActive = rowEngineId === activeEngineId;
    const rowIsPlaying = rowIsActive && isPlaying;
    const stateText = rowIsPlaying ? 'Playing' : rowIsActive ? 'Paused' : 'Play';
    const labelAction = rowIsPlaying ? 'Pause' : 'Play';
    const playState = row.querySelector('.pu-supplier__playstate');

    row.classList.toggle('is-active', rowIsActive);
    row.classList.toggle('is-playing', rowIsPlaying);
    row.setAttribute('aria-pressed', String(rowIsActive));
    row.setAttribute('aria-label', `${labelAction} ${rowEngineName} engine sound`);
    if (playState) playState.textContent = stateText;
  });
}

function toggleEnginePlayback(row) {
  if (!engineAudioPlayer) return;
  const engineId = row.dataset.engineId;
  const engineName = row.dataset.engineName;
  const audioSrc = row.dataset.audioSrc;

  if (!engineId || !engineName || !audioSrc) return;

  if (activeEngineId === engineId) {
    if (engineAudioPlayer.paused) {
      engineAudioPlayer.play().then(() => {
        updateEngineRows();
      }).catch(() => {
        console.warn(`Couldn't play ${engineName} right now.`);
        activeEngineId = null;
        updateEngineRows();
      });
    } else {
      engineAudioPlayer.pause();
    }
    updateEngineRows();
    return;
  }

  activeEngineId = engineId;
  engineAudioPlayer.src = audioSrc;
  engineAudioPlayer.currentTime = 0;
  engineAudioPlayer.play().then(() => {
    updateEngineRows();
  }).catch(() => {
    console.warn(`Couldn't load ${engineName}.`);
    activeEngineId = null;
    updateEngineRows();
  });
  updateEngineRows();
}

if (engineRows.length && engineAudioPlayer) {
  engineRows.forEach((row) => {
    row.addEventListener('click', () => toggleEnginePlayback(row));
  });

  engineAudioPlayer.addEventListener('play', updateEngineRows);
  engineAudioPlayer.addEventListener('pause', updateEngineRows);
  engineAudioPlayer.addEventListener('ended', () => {
    activeEngineId = null;
    updateEngineRows();
  });
  engineAudioPlayer.addEventListener('error', () => {
    const failedRow = engineRows.find((row) => row.dataset.engineId === activeEngineId);
    const failedName = failedRow ? failedRow.dataset.engineName : 'this clip';
    console.warn(`Audio unavailable for ${failedName}.`);
    activeEngineId = null;
    updateEngineRows();
  });

  updateEngineRows();
}

// ── Smooth scroll for nav links ──
document.querySelectorAll('.navbar__links a, .mobile-nav__toc-link, .toc__link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Mobile nav ──
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburgerBtn');
  nav.classList.toggle('open');
  btn.classList.toggle('active');
}

function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('hamburgerBtn').classList.remove('active');
}

// Close mobile nav on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) closeMobileNav();
});

// ── Active nav link on scroll ──
const navLinks = document.querySelectorAll('.navbar__links a');
const tocLinks = document.querySelectorAll('.toc__link');
const mobileTocLinks = document.querySelectorAll('.mobile-nav__toc-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
      tocLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
      mobileTocLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0, rootMargin: '-50% 0px -50% 0px' });

document.querySelectorAll('section[id]').forEach(section => {
  sectionObserver.observe(section);
});

// ── TOC visibility ──
(function() {
  const toc = document.getElementById('toc');
  const hero = document.querySelector('.hero');
  if (!toc || !hero) return;

  const tocObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      toc.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  tocObserver.observe(hero);
})();

// ── Share functionality ──
function copyPageUrl() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const btn = document.getElementById('copyUrlBtn');
    const label = document.getElementById('copyUrlLabel');
    btn.classList.add('copied');
    label.textContent = 'Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      label.textContent = 'Copy Link';
    }, 2000);
  });
}

function nativeShare() {
  navigator.share({
    title: 'Welcome to Formula 1',
    text: 'Everything you need to know about Formula 1 — the cars, the drivers, the drama.',
    url: window.location.href
  });
}

// Show native share button if supported
if (navigator.share) {
  document.getElementById('nativeShareBtn').style.display = 'flex';
}

// ── Race week banner ──
// FP1 start and race start times in UTC, sourced from ESPN's 2026 F1 schedule.
// Storing as UTC means the browser automatically converts to the visitor's local timezone.
(function() {
  const races = [
    { round: 1,  name: 'Australian Grand Prix',     location: 'Melbourne',   fp1: '2026-03-06T01:30Z', race: '2026-03-08T04:00Z', results: ['RUS', 'ANT', 'LEC'] },
    { round: 2,  name: 'Chinese Grand Prix',         location: 'Shanghai',    fp1: '2026-03-13T04:30Z', race: '2026-03-15T08:00Z', results: ['ANT', 'RUS', 'HAM'] },
    { round: 3,  name: 'Japanese Grand Prix',        location: 'Suzuka',      fp1: '2026-03-27T02:30Z', race: '2026-03-29T05:00Z', results: null },
    { round: 4,  name: 'Bahrain Grand Prix',         location: 'Sakhir',      fp1: '2026-04-10T11:30Z', race: '2026-04-12T15:00Z', results: null, cancelled: true },
    { round: 5,  name: 'Saudi Arabian Grand Prix',   location: 'Jeddah',      fp1: '2026-04-17T13:30Z', race: '2026-04-19T17:00Z', results: null, cancelled: true },
    { round: 6,  name: 'Miami Grand Prix',           location: 'Miami',       fp1: '2026-05-01T16:30Z', race: '2026-05-03T20:00Z', results: null },
    { round: 7,  name: 'Canadian Grand Prix',        location: 'Montreal',    fp1: '2026-05-22T16:30Z', race: '2026-05-24T20:00Z', results: null },
    { round: 8,  name: 'Monaco Grand Prix',          location: 'Monte Carlo', fp1: '2026-06-05T11:30Z', race: '2026-06-07T13:00Z', results: null },
    { round: 9,  name: 'Spanish Grand Prix',         location: 'Barcelona',   fp1: '2026-06-12T11:30Z', race: '2026-06-14T13:00Z', results: null },
    { round: 10, name: 'Austrian Grand Prix',        location: 'Spielberg',   fp1: '2026-06-26T11:30Z', race: '2026-06-28T13:00Z', results: null },
    { round: 11, name: 'British Grand Prix',         location: 'Silverstone', fp1: '2026-07-03T11:30Z', race: '2026-07-05T14:00Z', results: null },
    { round: 12, name: 'Belgian Grand Prix',         location: 'Spa',         fp1: '2026-07-17T11:30Z', race: '2026-07-19T13:00Z', results: null },
    { round: 13, name: 'Hungarian Grand Prix',       location: 'Budapest',    fp1: '2026-07-24T11:30Z', race: '2026-07-26T13:00Z', results: null },
    { round: 14, name: 'Dutch Grand Prix',           location: 'Zandvoort',   fp1: '2026-08-21T10:30Z', race: '2026-08-23T13:00Z', results: null },
    { round: 15, name: 'Italian Grand Prix',         location: 'Monza',       fp1: '2026-09-04T10:30Z', race: '2026-09-06T13:00Z', results: null },
    { round: 16, name: 'Madrid Grand Prix',          location: 'Madrid',      fp1: '2026-09-11T11:30Z', race: '2026-09-13T13:00Z', results: null },
    { round: 17, name: 'Azerbaijan Grand Prix',      location: 'Baku',        fp1: '2026-09-24T08:30Z', race: '2026-09-26T11:00Z', results: null },
    { round: 18, name: 'Singapore Grand Prix',       location: 'Singapore',   fp1: '2026-10-09T08:30Z', race: '2026-10-11T12:00Z', results: null },
    { round: 19, name: 'United States Grand Prix',   location: 'Austin',      fp1: '2026-10-23T17:30Z', race: '2026-10-25T20:00Z', results: null },
    { round: 20, name: 'Mexico City Grand Prix',     location: 'Mexico City', fp1: '2026-10-30T18:30Z', race: '2026-11-01T20:00Z', results: null },
    { round: 21, name: 'São Paulo Grand Prix',       location: 'São Paulo',   fp1: '2026-11-06T15:30Z', race: '2026-11-08T17:00Z', results: null },
    { round: 22, name: 'Las Vegas Grand Prix',       location: 'Las Vegas',   fp1: '2026-11-20T00:30Z', race: '2026-11-22T04:00Z', results: null },
    { round: 23, name: 'Qatar Grand Prix',           location: 'Lusail',      fp1: '2026-11-27T13:30Z', race: '2026-11-29T16:00Z', results: null },
    { round: 24, name: 'Abu Dhabi Grand Prix',       location: 'Abu Dhabi',   fp1: '2026-12-04T09:30Z', race: '2026-12-06T13:00Z', results: null },
  ];

  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get('date');
  const now = dateParam && /^\d{8}$/.test(dateParam)
    ? new Date(dateParam.slice(0,4) + '-' + dateParam.slice(4,6) + '-' + dateParam.slice(6,8) + 'T12:00:00')
    : new Date();

  for (const r of races) {
    const fp1 = new Date(r.fp1);
    const race = new Date(r.race);
    const raceEnd = new Date(race.getTime() + 3 * 3600000);

    // Show banner from 4 days before FP1 through end of race
    const windowStart = new Date(fp1);
    windowStart.setDate(windowStart.getDate() - 4);
    windowStart.setHours(0, 0, 0, 0);

    if (now >= windowStart && now <= raceEnd && !r.results && !r.cancelled) {
      const banner = document.getElementById('raceWeekBanner');

      // Derive the visitor's local calendar dates from the UTC session times
      const startDay = new Date(fp1.getFullYear(), fp1.getMonth(), fp1.getDate());
      const endDay = new Date(race.getFullYear(), race.getMonth(), race.getDate());

      let dateStr;
      if (startDay.getMonth() === endDay.getMonth()) {
        dateStr = startDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + '–' + endDay.getDate();
      } else {
        dateStr = startDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ' – ' + endDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      }

      // Detect visitor's timezone abbreviation (e.g. "EST", "CDT", "PST")
      const tzAbbr = Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
        .formatToParts(now).find(function(p) { return p.type === 'timeZoneName'; })?.value || '';

      document.getElementById('raceWeekName').textContent = r.name;
      document.getElementById('raceWeekMeta').innerHTML =
        'Round ' + r.round + ' \u00B7 ' + r.location + ' \u00B7 ' + dateStr +
        ' <span class="race-week-banner__tz">' + tzAbbr + '</span>';

      banner.classList.add('active');

      // Highlight matching race in the calendar grid
      var calItem = document.querySelector('.schedule-item[data-round="' + r.round + '"]');
      if (calItem) calItem.classList.add('schedule-item--active');

      break;
    }
  }

  // Mark cancelled races
  for (const r of races) {
    if (r.cancelled) {
      var calItem = document.querySelector('.schedule-item[data-round="' + r.round + '"]');
      if (calItem) {
        calItem.classList.add('schedule-item--cancelled');
        var roundEl = calItem.querySelector('.schedule-item__round');
        if (roundEl) roundEl.textContent = '✗';
      }
    }
  }

  // Mark completed races
  for (const r of races) {
    if (r.cancelled) continue;
    const race = new Date(r.race);
    const raceEnd = new Date(race.getTime() + 3 * 3600000);

    if (now > raceEnd || r.results) {
      var calItem = document.querySelector('.schedule-item[data-round="' + r.round + '"]');
      if (calItem && !calItem.classList.contains('schedule-item--active')) {
        calItem.classList.add('schedule-item--completed');
        var roundEl = calItem.querySelector('.schedule-item__round');
        if (roundEl) roundEl.textContent = '✓';

        if (r.results) {
          var podium = document.createElement('span');
          podium.className = 'schedule-item__podium';
          podium.innerHTML =
            '<span class="podium__p1">1 ' + r.results[0] + '</span>' +
            '<span class="podium__p2">2 ' + r.results[1] + '</span>' +
            '<span class="podium__p3">3 ' + r.results[2] + '</span>';
          calItem.querySelector('.schedule-item__info').appendChild(podium);
        }
      }
    }
  }
})();

// ── Championship Standings Rendering ──
(function() {
  if (!driverStandings.length && !constructorStandings.length) return;

  function posClass(pos) {
    if (pos === 1) return 'pos-1';
    if (pos === 2) return 'pos-2';
    if (pos === 3) return 'pos-3';
    return '';
  }

  function updatedLabel() {
    if (!standingsLastUpdated) return '';
    var d = new Date(standingsLastUpdated);
    return '<div class="standings-updated">Updated ' + d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + '</div>';
  }

  // Driver standings table
  if (driverStandings.length) {
    var dEl = document.getElementById('driverStandingsTable');
    if (dEl) {
      var html = '<h3>2026 Driver Standings</h3>' + updatedLabel();
      html += '<table class="standings-table"><thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Pts</th><th>Wins</th></tr></thead><tbody>';
      driverStandings.forEach(function(d) {
        html += '<tr class="' + posClass(d.pos) + '"><td>' + d.pos + '</td><td>' + d.name + '</td><td>' + d.team + '</td><td>' + d.points + '</td><td>' + d.wins + '</td></tr>';
      });
      html += '</tbody></table>';
      dEl.innerHTML = html;
    }
  }

  // Constructor standings table
  if (constructorStandings.length) {
    var cEl = document.getElementById('constructorStandingsTable');
    if (cEl) {
      var html = '<h3>2026 Constructor Standings</h3>';
      html += '<table class="standings-table"><thead><tr><th>Pos</th><th>Team</th><th>Pts</th><th>Wins</th></tr></thead><tbody>';
      constructorStandings.forEach(function(c) {
        html += '<tr class="' + posClass(c.pos) + '"><td>' + c.pos + '</td><td>' + c.name + '</td><td>' + c.points + '</td><td>' + c.wins + '</td></tr>';
      });
      html += '</tbody></table>';
      cEl.innerHTML = html;
    }
  }

  // Inject points into driver cards
  if (driverStandings.length) {
    document.querySelectorAll('.driver-card__name').forEach(function(nameEl) {
      var name = nameEl.textContent.trim();
      var lastName = name.split(' ').slice(-1)[0];
      var match = driverStandings.find(function(d) { return d.name === name; })
        || driverStandings.find(function(d) { return d.name.split(' ').slice(-1)[0] === lastName && d.name[0] === name[0]; });
      if (match) {
        var ptsEl = document.createElement('div');
        ptsEl.className = 'driver-card__points';
        ptsEl.textContent = match.points + ' pts';
        var info = nameEl.closest('.driver-card__info');
        var social = info.querySelector('.social-links');
        if (social) info.insertBefore(ptsEl, social);
        else info.appendChild(ptsEl);
      }
    });
  }

  // Inject points into team cards
  if (constructorStandings.length) {
    document.querySelectorAll('.team-card__name').forEach(function(nameEl) {
      var name = nameEl.textContent.trim();
      var match = constructorStandings.find(function(c) { return c.name === name; });
      if (match) {
        var ptsEl = document.createElement('div');
        ptsEl.className = 'team-card__points';
        ptsEl.textContent = 'P' + match.pos + ' \u2014 ' + match.points + ' pts';
        var info = nameEl.closest('.team-card__info');
        var social = info.querySelector('.social-links');
        if (social) info.insertBefore(ptsEl, social);
        else info.appendChild(ptsEl);
      }
    });
  }
})();
