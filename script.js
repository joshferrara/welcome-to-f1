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

// ── World Champions Data ──
const championsData = [
  // 1950s
  { year: 1950, driver: 'Giuseppe Farina', nationality: 'IT', team: 'Alfa Romeo', constructor: null },
  { year: 1951, driver: 'Juan Manuel Fangio', nationality: 'AR', team: 'Alfa Romeo', constructor: null },
  { year: 1952, driver: 'Alberto Ascari', nationality: 'IT', team: 'Ferrari', constructor: null },
  { year: 1953, driver: 'Alberto Ascari', nationality: 'IT', team: 'Ferrari', constructor: null },
  { year: 1954, driver: 'Juan Manuel Fangio', nationality: 'AR', team: 'Mercedes', constructor: null },
  { year: 1955, driver: 'Juan Manuel Fangio', nationality: 'AR', team: 'Mercedes', constructor: null },
  { year: 1956, driver: 'Juan Manuel Fangio', nationality: 'AR', team: 'Ferrari', constructor: null },
  { year: 1957, driver: 'Juan Manuel Fangio', nationality: 'AR', team: 'Maserati', constructor: null },
  { year: 1958, driver: 'Mike Hawthorn', nationality: 'GB', team: 'Ferrari', constructor: 'Vanwall' },
  { year: 1959, driver: 'Jack Brabham', nationality: 'AU', team: 'Cooper', constructor: 'Cooper' },
  // 1960s
  { year: 1960, driver: 'Jack Brabham', nationality: 'AU', team: 'Cooper', constructor: 'Cooper' },
  { year: 1961, driver: 'Phil Hill', nationality: 'US', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 1962, driver: 'Graham Hill', nationality: 'GB', team: 'BRM', constructor: 'BRM' },
  { year: 1963, driver: 'Jim Clark', nationality: 'GB', team: 'Lotus', constructor: 'Lotus' },
  { year: 1964, driver: 'John Surtees', nationality: 'GB', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 1965, driver: 'Jim Clark', nationality: 'GB', team: 'Lotus', constructor: 'Lotus' },
  { year: 1966, driver: 'Jack Brabham', nationality: 'AU', team: 'Brabham', constructor: 'Brabham' },
  { year: 1967, driver: 'Denny Hulme', nationality: 'NZ', team: 'Brabham', constructor: 'Brabham' },
  { year: 1968, driver: 'Graham Hill', nationality: 'GB', team: 'Lotus', constructor: 'Lotus' },
  { year: 1969, driver: 'Jackie Stewart', nationality: 'GB', team: 'Matra', constructor: 'Matra' },
  // 1970s
  { year: 1970, driver: 'Jochen Rindt', nationality: 'AT', team: 'Lotus', constructor: 'Lotus' },
  { year: 1971, driver: 'Jackie Stewart', nationality: 'GB', team: 'Tyrrell', constructor: 'Tyrrell' },
  { year: 1972, driver: 'Emerson Fittipaldi', nationality: 'BR', team: 'Lotus', constructor: 'Lotus' },
  { year: 1973, driver: 'Jackie Stewart', nationality: 'GB', team: 'Tyrrell', constructor: 'Lotus' },
  { year: 1974, driver: 'Emerson Fittipaldi', nationality: 'BR', team: 'McLaren', constructor: 'McLaren' },
  { year: 1975, driver: 'Niki Lauda', nationality: 'AT', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 1976, driver: 'James Hunt', nationality: 'GB', team: 'McLaren', constructor: 'Ferrari' },
  { year: 1977, driver: 'Niki Lauda', nationality: 'AT', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 1978, driver: 'Mario Andretti', nationality: 'US', team: 'Lotus', constructor: 'Lotus' },
  { year: 1979, driver: 'Jody Scheckter', nationality: 'ZA', team: 'Ferrari', constructor: 'Ferrari' },
  // 1980s
  { year: 1980, driver: 'Alan Jones', nationality: 'AU', team: 'Williams', constructor: 'Williams' },
  { year: 1981, driver: 'Nelson Piquet', nationality: 'BR', team: 'Brabham', constructor: 'Williams' },
  { year: 1982, driver: 'Keke Rosberg', nationality: 'FI', team: 'Williams', constructor: 'Ferrari' },
  { year: 1983, driver: 'Nelson Piquet', nationality: 'BR', team: 'Brabham', constructor: 'Ferrari' },
  { year: 1984, driver: 'Niki Lauda', nationality: 'AT', team: 'McLaren', constructor: 'McLaren' },
  { year: 1985, driver: 'Alain Prost', nationality: 'FR', team: 'McLaren', constructor: 'McLaren' },
  { year: 1986, driver: 'Alain Prost', nationality: 'FR', team: 'McLaren', constructor: 'Williams' },
  { year: 1987, driver: 'Nelson Piquet', nationality: 'BR', team: 'Williams', constructor: 'Williams' },
  { year: 1988, driver: 'Ayrton Senna', nationality: 'BR', team: 'McLaren', constructor: 'McLaren' },
  { year: 1989, driver: 'Alain Prost', nationality: 'FR', team: 'McLaren', constructor: 'McLaren' },
  // 1990s
  { year: 1990, driver: 'Ayrton Senna', nationality: 'BR', team: 'McLaren', constructor: 'McLaren' },
  { year: 1991, driver: 'Ayrton Senna', nationality: 'BR', team: 'McLaren', constructor: 'McLaren' },
  { year: 1992, driver: 'Nigel Mansell', nationality: 'GB', team: 'Williams', constructor: 'Williams' },
  { year: 1993, driver: 'Alain Prost', nationality: 'FR', team: 'Williams', constructor: 'Williams' },
  { year: 1994, driver: 'Michael Schumacher', nationality: 'DE', team: 'Benetton', constructor: 'Williams' },
  { year: 1995, driver: 'Michael Schumacher', nationality: 'DE', team: 'Benetton', constructor: 'Benetton' },
  { year: 1996, driver: 'Damon Hill', nationality: 'GB', team: 'Williams', constructor: 'Williams' },
  { year: 1997, driver: 'Jacques Villeneuve', nationality: 'CA', team: 'Williams', constructor: 'Williams' },
  { year: 1998, driver: 'Mika Häkkinen', nationality: 'FI', team: 'McLaren', constructor: 'McLaren' },
  { year: 1999, driver: 'Mika Häkkinen', nationality: 'FI', team: 'McLaren', constructor: 'Ferrari' },
  // 2000s
  { year: 2000, driver: 'Michael Schumacher', nationality: 'DE', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 2001, driver: 'Michael Schumacher', nationality: 'DE', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 2002, driver: 'Michael Schumacher', nationality: 'DE', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 2003, driver: 'Michael Schumacher', nationality: 'DE', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 2004, driver: 'Michael Schumacher', nationality: 'DE', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 2005, driver: 'Fernando Alonso', nationality: 'ES', team: 'Renault', constructor: 'Renault' },
  { year: 2006, driver: 'Fernando Alonso', nationality: 'ES', team: 'Renault', constructor: 'Renault' },
  { year: 2007, driver: 'Kimi Räikkönen', nationality: 'FI', team: 'Ferrari', constructor: 'Ferrari' },
  { year: 2008, driver: 'Lewis Hamilton', nationality: 'GB', team: 'McLaren', constructor: 'Ferrari' },
  { year: 2009, driver: 'Jenson Button', nationality: 'GB', team: 'Brawn', constructor: 'Brawn' },
  // 2010s
  { year: 2010, driver: 'Sebastian Vettel', nationality: 'DE', team: 'Red Bull', constructor: 'Red Bull' },
  { year: 2011, driver: 'Sebastian Vettel', nationality: 'DE', team: 'Red Bull', constructor: 'Red Bull' },
  { year: 2012, driver: 'Sebastian Vettel', nationality: 'DE', team: 'Red Bull', constructor: 'Red Bull' },
  { year: 2013, driver: 'Sebastian Vettel', nationality: 'DE', team: 'Red Bull', constructor: 'Red Bull' },
  { year: 2014, driver: 'Lewis Hamilton', nationality: 'GB', team: 'Mercedes', constructor: 'Mercedes' },
  { year: 2015, driver: 'Lewis Hamilton', nationality: 'GB', team: 'Mercedes', constructor: 'Mercedes' },
  { year: 2016, driver: 'Nico Rosberg', nationality: 'DE', team: 'Mercedes', constructor: 'Mercedes' },
  { year: 2017, driver: 'Lewis Hamilton', nationality: 'GB', team: 'Mercedes', constructor: 'Mercedes' },
  { year: 2018, driver: 'Lewis Hamilton', nationality: 'GB', team: 'Mercedes', constructor: 'Mercedes' },
  { year: 2019, driver: 'Lewis Hamilton', nationality: 'GB', team: 'Mercedes', constructor: 'Mercedes' },
  // 2020s
  { year: 2020, driver: 'Lewis Hamilton', nationality: 'GB', team: 'Mercedes', constructor: 'Mercedes' },
  { year: 2021, driver: 'Max Verstappen', nationality: 'NL', team: 'Red Bull', constructor: 'Mercedes' },
  { year: 2022, driver: 'Max Verstappen', nationality: 'NL', team: 'Red Bull', constructor: 'Red Bull' },
  { year: 2023, driver: 'Max Verstappen', nationality: 'NL', team: 'Red Bull', constructor: 'Red Bull' },
  { year: 2024, driver: 'Max Verstappen', nationality: 'NL', team: 'Red Bull', constructor: 'McLaren' },
  { year: 2025, driver: 'Lando Norris', nationality: 'GB', team: 'McLaren', constructor: 'McLaren' },
];

const championFlagMap = {
  'IT': '🇮🇹', 'AR': '🇦🇷', 'GB': '🇬🇧',
  'AU': '🇦🇺', 'US': '🇺🇸', 'NZ': '🇳🇿',
  'AT': '🇦🇹', 'BR': '🇧🇷', 'ZA': '🇿🇦',
  'FI': '🇫🇮', 'FR': '🇫🇷', 'DE': '🇩🇪',
  'CA': '🇨🇦', 'ES': '🇪🇸', 'NL': '🇳🇱',
};

const championTeamColors = {
  'Ferrari': '#E8002D', 'McLaren': '#FF8000', 'Mercedes': '#27F4D2',
  'Red Bull': '#3671C6', 'Williams': '#64C4FF', 'Renault': '#FFD700',
  'Alfa Romeo': '#900000', 'Maserati': '#1C3A72', 'Cooper': '#004225',
  'Vanwall': '#004D40', 'BRM': '#1B5E20', 'Lotus': '#DAA520',
  'Brabham': '#006A4E', 'Matra': '#002FA7', 'Tyrrell': '#00529C',
  'Benetton': '#00A651', 'Brawn': '#C8E600',
};

const constructorDrivers = {
  1958: ['Moss', 'Brooks'], 1959: ['Brabham', 'McLaren'], 1960: ['Brabham', 'McLaren'],
  1961: ['P. Hill', 'von Trips'], 1962: ['G. Hill', 'Ginther'], 1963: ['Clark', 'Taylor'],
  1964: ['Surtees', 'Bandini'], 1965: ['Clark', 'Spence'], 1966: ['Brabham', 'Hulme'],
  1967: ['Hulme', 'Brabham'], 1968: ['G. Hill', 'Oliver'], 1969: ['Stewart', 'Beltoise'],
  1970: ['Rindt', 'Fittipaldi'], 1971: ['Stewart', 'Cevert'], 1972: ['Fittipaldi', 'Walker'],
  1973: ['Fittipaldi', 'Peterson'], 1974: ['Fittipaldi', 'Hulme'], 1975: ['Lauda', 'Regazzoni'],
  1976: ['Lauda', 'Regazzoni'], 1977: ['Lauda', 'Reutemann'], 1978: ['Andretti', 'Peterson'],
  1979: ['Scheckter', 'Villeneuve'], 1980: ['Jones', 'Reutemann'], 1981: ['Reutemann', 'Jones'],
  1982: ['Pironi', 'Tambay'], 1983: ['Arnoux', 'Tambay'], 1984: ['Lauda', 'Prost'],
  1985: ['Prost', 'Lauda'], 1986: ['Mansell', 'Piquet'], 1987: ['Piquet', 'Mansell'],
  1988: ['Senna', 'Prost'], 1989: ['Prost', 'Senna'], 1990: ['Senna', 'Berger'],
  1991: ['Senna', 'Berger'], 1992: ['Mansell', 'Patrese'], 1993: ['Prost', 'Hill'],
  1994: ['Hill', 'Coulthard'], 1995: ['Schumacher', 'Herbert'], 1996: ['Hill', 'Villeneuve'],
  1997: ['Villeneuve', 'Frentzen'], 1998: ['Häkkinen', 'Coulthard'], 1999: ['Irvine', 'M. Schumacher'],
  2000: ['M. Schumacher', 'Barrichello'], 2001: ['M. Schumacher', 'Barrichello'],
  2002: ['M. Schumacher', 'Barrichello'], 2003: ['M. Schumacher', 'Barrichello'],
  2004: ['M. Schumacher', 'Barrichello'], 2005: ['Alonso', 'Fisichella'],
  2006: ['Alonso', 'Fisichella'], 2007: ['Räikkönen', 'Massa'], 2008: ['Massa', 'Räikkönen'],
  2009: ['Button', 'Barrichello'], 2010: ['Vettel', 'Webber'], 2011: ['Vettel', 'Webber'],
  2012: ['Vettel', 'Webber'], 2013: ['Vettel', 'Webber'], 2014: ['Hamilton', 'Rosberg'],
  2015: ['Hamilton', 'Rosberg'], 2016: ['Rosberg', 'Hamilton'], 2017: ['Hamilton', 'Bottas'],
  2018: ['Hamilton', 'Bottas'], 2019: ['Hamilton', 'Bottas'], 2020: ['Hamilton', 'Bottas'],
  2021: ['Hamilton', 'Bottas'], 2022: ['Verstappen', 'Pérez'], 2023: ['Verstappen', 'Pérez'],
  2024: ['Norris', 'Piastri'],
  2025: ['Norris', 'Piastri'],
};

// ── World Champions Rendering ──
function renderChampionsTable(decade) {
  var container = document.getElementById('championsTable');
  if (!container) return;

  var startYear = parseInt(decade, 10);
  var endYear = startYear + 9;
  var rows = championsData.filter(function(d) { return d.year >= startYear && d.year <= endYear; });

  function getTeamColor(teamName) {
    if (!teamName) return '';
    return championTeamColors[teamName] || '';
  }

  var html = '<table class="champions-table">';
  html += '<thead><tr><th>Year</th><th>Driver</th><th>Constructor</th></tr></thead>';
  html += '<tbody>';

  rows.forEach(function(row) {
    var flag = championFlagMap[row.nationality] || '';
    var teamColor = getTeamColor(row.team);
    var constructorColor = getTeamColor(row.constructor);
    var styleProps = [];
    if (teamColor) styleProps.push('--row-team-color: ' + teamColor);
    if (constructorColor) styleProps.push('--row-constructor-color: ' + constructorColor);
    var style = styleProps.length ? ' style="' + styleProps.join('; ') + '"' : '';
    var teamColorAttr = teamColor ? ' data-team-color' : '';
    var constructorColorAttr = constructorColor ? ' data-constructor-color' : '';

    html += '<tr' + style + teamColorAttr + constructorColorAttr + '>';
    html += '<td class="champions-year">' + row.year + '</td>';
    html += '<td class="champions-driver"><span class="champions-flag">' + flag + '</span>' + row.driver + '<span class="champions-driver-team">';
    if (teamColor) html += '<span class="champions-team-color" style="background:' + teamColor + '"></span>';
    html += row.team + '</span></td>';

    if (row.constructor) {
      var drivers = constructorDrivers[row.year];
      html += '<td class="champions-constructor">';
      if (constructorColor) html += '<span class="champions-team-color" style="background:' + constructorColor + '"></span>';
      html += row.constructor;
      if (drivers) html += '<span class="champions-constructor-drivers">' + drivers[0] + ' &middot; ' + drivers[1] + '</span>';
      html += '</td>';
    } else {
      html += '<td class="champions-na">&mdash;</td>';
    }

    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

(function initChampionsTabs() {
  var tabs = document.querySelectorAll('.champions-tab');
  if (!tabs.length) return;

  function activateTab(tab) {
    tabs.forEach(function(t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();

    // Fade transition: fade out, swap content, fade in
    var wrapper = document.getElementById('championsTable');
    if (wrapper && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrapper.classList.add('is-switching');
      setTimeout(function() {
        renderChampionsTable(tab.dataset.decade);
        wrapper.classList.remove('is-switching');
      }, 150);
    } else {
      renderChampionsTable(tab.dataset.decade);
    }
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      activateTab(tab);
    });
  });

  // Keyboard navigation: left/right arrows
  var tabContainer = document.querySelector('.champions-tabs');
  if (tabContainer) {
    tabContainer.addEventListener('keydown', function(e) {
      var tabArray = Array.from(tabs);
      var currentIndex = tabArray.findIndex(function(t) { return t.classList.contains('active'); });
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var newIndex;
        if (e.key === 'ArrowRight') {
          newIndex = (currentIndex + 1) % tabArray.length;
        } else {
          newIndex = (currentIndex - 1 + tabArray.length) % tabArray.length;
        }
        activateTab(tabArray[newIndex]);
      }
    });
  }

  // Render default tab (2020s)
  renderChampionsTable('2020');
})();

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

// ── Action bindings (replaces inline onclick handlers) ──
document.addEventListener('click', function(e) {
  const trigger = e.target.closest('[data-action]');
  if (!trigger) return;
  const action = trigger.dataset.action;

  if (action === 'set-units') {
    e.preventDefault();
    setUnits(trigger.dataset.unit || 'imperial');
  } else if (action === 'toggle-theme') {
    e.preventDefault();
    toggleTheme();
  } else if (action === 'toggle-mobile-nav') {
    e.preventDefault();
    toggleMobileNav();
  } else if (action === 'close-mobile-nav') {
    closeMobileNav();
  } else if (action === 'copy-url') {
    e.preventDefault();
    copyPageUrl();
  } else if (action === 'native-share') {
    e.preventDefault();
    nativeShare();
  }
});

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
function announceShareResult(message) {
  const label = document.getElementById('copyUrlLabel');
  if (label) label.textContent = message;
  setTimeout(() => {
    if (label) label.textContent = 'Copy Link';
  }, 2000);
}

function copyPageUrl() {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    announceShareResult('Clipboard blocked');
    return;
  }

  navigator.clipboard.writeText(window.location.href).then(() => {
    const btn = document.getElementById('copyUrlBtn');
    if (btn) btn.classList.add('copied');
    announceShareResult('Copied!');
    setTimeout(() => {
      if (btn) btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    announceShareResult('Copy failed');
  });
}

function nativeShare() {
  if (!navigator.share) return;
  navigator.share({
    title: 'Welcome to Formula 1',
    text: 'Everything you need to know about Formula 1 — the cars, the drivers, the drama.',
    url: window.location.href
  }).catch(() => {
    announceShareResult('Use copy link');
  });
}

// Show native share button if supported
if (navigator.share) {
  document.getElementById('nativeShareBtn').style.display = 'flex';
}

// ── Race week banner + schedule rendering ──
(function() {
  const races = Array.isArray(window.racesData) ? window.racesData : [];
  const raceRows = races.filter(function(r) { return !r.type; });
  const scheduleGrid = document.getElementById('scheduleGrid');
  const timelineRaceSelect = document.getElementById('timelineRaceSelect');
  const timelinePanel = document.getElementById('timelinePanel');
  const calendarLastUpdated = document.getElementById('calendarLastUpdated');

  function formatRaceDetail(r) {
    const fp1 = new Date(r.fp1);
    const race = new Date(r.race);
    const start = fp1.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = race.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return r.location + ' \u2022 ' + start + '\u2013' + end;
  }

  function renderSchedule() {
    if (!scheduleGrid) return;
    scheduleGrid.innerHTML = '';

    races.forEach(function(item) {
      const card = document.createElement('div');
      card.className = 'schedule-item';

      if (item.type === 'break') {
        card.classList.add('schedule-item--break');
        card.innerHTML = '<span class="schedule-item__round">\u2014</span><div class="schedule-item__info"><span class="schedule-item__name">' + item.label + '</span><span class="schedule-item__detail">' + item.detail + '</span></div>';
        scheduleGrid.appendChild(card);
        return;
      }

      card.dataset.round = item.round;
      card.innerHTML = '<span class="schedule-item__round">R' + item.round + '</span><div class="schedule-item__info"><span class="schedule-item__name">' + item.name + (item.isNew ? ' <span class="schedule-item__badge">NEW</span>' : '') + '</span><span class="schedule-item__detail">' + formatRaceDetail(item) + '</span></div>';
      scheduleGrid.appendChild(card);
    });
  }

  function renderTimelineOptions() {
    if (!timelineRaceSelect) return;
    timelineRaceSelect.innerHTML = raceRows.map(function(r) {
      return '<option value="' + r.round + '">R' + r.round + ' \u00b7 ' + r.name + '</option>';
    }).join('');
  }

  function formatSessionLine(label, iso) {
    const d = new Date(iso);
    const when = d.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    return '<div class="timeline-row"><span>' + label + '</span><strong>' + when + '</strong></div>';
  }

  function renderTimeline(round) {
    if (!timelinePanel) return;
    const race = raceRows.find(function(r) { return String(r.round) === String(round); }) || raceRows[0];
    if (!race) return;
    const isSprint = Boolean(race.sprintWeekend);
    const sprintTag = isSprint ? '<span class="timeline-badge">Sprint weekend</span>' : '';
    const sessions = isSprint
      ? [
        ['FP1', race.fp1],
        ['Sprint Qualifying', race.sprintQualifying],
        ['Sprint', race.sprint],
        ['Qualifying', race.qualifying],
        ['Race', race.race]
      ]
      : [
        ['FP1', race.fp1],
        ['FP2', race.fp2],
        ['FP3', race.fp3],
        ['Qualifying', race.qualifying],
        ['Race', race.race]
      ];

    timelinePanel.innerHTML = '<div class="timeline-header"><div><strong>' + race.name + '</strong><span>' + race.location + '</span></div>' + sprintTag + '</div>' +
      sessions.map(function(session) {
        return formatSessionLine(session[0], session[1]);
      }).join('');
  }

  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get('date');
  const now = dateParam && /^\d{8}$/.test(dateParam)
    ? new Date(dateParam.slice(0,4) + '-' + dateParam.slice(4,6) + '-' + dateParam.slice(6,8) + 'T12:00:00')
    : new Date();

  renderSchedule();
  renderTimelineOptions();
  renderTimeline(raceRows[0] && raceRows[0].round);

  for (const r of raceRows) {
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
  for (const r of raceRows) {
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
  for (const r of raceRows) {
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
  if (timelineRaceSelect) {
    timelineRaceSelect.addEventListener('change', function() {
      renderTimeline(timelineRaceSelect.value);
    });
  }
  if (calendarLastUpdated) {
    calendarLastUpdated.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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

// ── Delight: Stat card value count-up on reveal ──
(function() {
  var statValues = document.querySelectorAll('.stat-card__value');
  if (!statValues.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var countObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      var el = entry.target;
      // Skip values with child elements (e.g. unit toggle spans) to avoid destroying their HTML
      if (el.querySelector('.unit')) return;
      var text = el.textContent.trim();
      // Extract leading number for count-up (e.g. "1.80s" → 1.80, "$15M" → 15, "6G" → 6)
      var match = text.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
      if (!match) return;
      var prefix = match[1];
      var numStr = match[2].replace(/,/g, '');
      var suffix = match[3];
      var target = parseFloat(numStr);
      if (isNaN(target) || target === 0) return;
      var hasComma = match[2].indexOf(',') > -1;
      var decimals = numStr.indexOf('.') > -1 ? numStr.split('.')[1].length : 0;
      var duration = 800;
      var start = performance.now();
      el.textContent = prefix + '0' + suffix;

      function update(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = eased * target;
        var formatted = current.toFixed(decimals);
        if (hasComma) formatted = Number(formatted).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        el.textContent = prefix + formatted + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = text; // restore exact original
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  statValues.forEach(function(el) { countObserver.observe(el); });
})();

// ── Delight: Pitstop timer click-to-replay ──
(function() {
  var timer = document.getElementById('pitstopTimer');
  if (!timer) return;
  timer.addEventListener('click', function() {
    animatePitstop();
  });
})();

// ── Delight: Console easter egg ──
console.log(
  '%c\ud83c\udfc1 Welcome to Formula 1 %c\n' +
  'Like what you see? This guide is open source.\n' +
  'Contribute: https://github.com/joshferrara/welcome-to-f1\n',
  'font-size: 20px; font-weight: bold; color: #E10600; padding: 8px 0;',
  'font-size: 13px; color: #888;'
);
