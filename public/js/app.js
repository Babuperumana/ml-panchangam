const datePicker = document.getElementById('datePicker');
const content = document.getElementById('content');
const prevBtn = document.getElementById('prevDay');
const nextBtn = document.getElementById('nextDay');
const todayBtn = document.getElementById('today');
const calToggle = document.getElementById('calToggle');

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

let currentDate = new Date();
let isCalendarView = false;
let calYear = currentDate.getFullYear();
let calMonth = currentDate.getMonth() + 1;
datePicker.value = formatDate(currentDate);

async function fetchPanchangam(dateStr) {
  content.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <br>പഞ്ചാംഗം ലോഡ് ചെയ്യുന്നു...
    </div>`;

  try {
    const res = await fetch(`/api/panchangam?date=${dateStr}`);
    const data = await res.json();
    if (data.error) throw new Error(data.details || data.error);
    renderPanchangam(data);
  } catch (err) {
    content.innerHTML = `<div class="loading" style="color:red;">
      Error: ${err.message}
    </div>`;
  }
}

function renderPanchangam(d) {
  content.innerHTML = `
    <!-- Summary Card -->
    <div class="summary-card">
      <div class="gregorian-date">${d.gregorian.date} &bull; ${d.gregorian.day}</div>
      <div class="ml-day">${d.weekday.ml}</div>
      <div class="kv-date">
        ${d.kollavarsham.monthMl} ${d.kollavarsham.day}, ${d.kollavarsham.year}
        <br>
        <span style="font-size:0.9rem;opacity:0.8">${d.kollavarsham.month} ${d.kollavarsham.day}, ${d.kollavarsham.year} (കൊല്ലവർഷം)</span>
      </div>
      <div class="nakshathram-highlight ${d.isNakshatramLess ? 'nak-less-highlight' : ''}">
        ${d.isNakshatramLess
          ? 'നക്ഷത്രം ഇല്ലാത്ത ദിവസം <span style="font-size:0.85rem;opacity:0.8">(Nakshathram-less Day)</span>'
          : `നക്ഷത്രം: <span class="ml">${d.nakshathram.ml}</span>
             <span style="font-size:0.85rem;opacity:0.8"> (${d.nakshathram.en})</span>`
        }
      </div>
    </div>

    <!-- Sun Times -->
    <div class="cards-grid">
      <div class="card sun-card">
        <div class="sun-item">
          <div class="icon">🌅</div>
          <div class="time">${d.sunrise}</div>
          <div class="label">സുര്യോദയം / Sunrise</div>
        </div>
        <div class="divider"></div>
        <div class="sun-item">
          <div class="icon">🌇</div>
          <div class="time">${d.sunset}</div>
          <div class="label">അസ്തമയം / Sunset</div>
        </div>
      </div>

      <!-- Tithi -->
      <div class="card">
        <div class="card-icon">🌙</div>
        <div class="card-label">തിഥി / Tithi</div>
        <div class="card-value-ml">${d.tithi.nameMl}</div>
        <div class="card-value-en">${d.tithi.name} (${d.tithi.paksha})</div>
      </div>

      <!-- Nakshathram -->
      <div class="card ${d.isNakshatramLess ? 'nak-less-card' : ''}">
        <div class="card-icon">${d.isNakshatramLess ? '⚠️' : '⭐'}</div>
        <div class="card-label">നക്ഷത്രം / Nakshathram</div>
        ${d.isNakshatramLess ? `
          <div class="card-value-ml nak-less">നക്ഷത്രം ഇല്ലാത്ത ദിവസം</div>
          <div class="card-value-en">Nakshathram-less Day</div>
          <div class="card-note">ഇന്നത്തെ സൂര്യോദയത്തിനു ശേഷം ആറു നാഴിക (ഏകദേശം 2 മണിക്കൂർ 24 മിനിറ്റ്) സമയത്ത് കാണുന്ന <strong>${d.nakshathram.ml} (${d.nakshathram.en})</strong> നക്ഷത്രം നാളത്തെ സൂര്യോദയശേഷവും ആറു നാഴിക നിലനിൽക്കുന്നതിനാൽ, ആ നക്ഷത്രം നാളത്തേക്ക് നിർണ്ണയിക്കപ്പെടുന്നു. അതിനാൽ ഇന്ന് നക്ഷത്രവിഹീന ദിനമാണ്.</div>
        ` : `
          <div class="card-value-ml">${d.nakshathram.ml}</div>
          <div class="card-value-en">${d.nakshathram.en}</div>
          <div class="card-note">സൂര്യോദയത്തിനു ശേഷം ആറു നാഴിക (ഏകദേശം 2 മണിക്കൂർ 24 മിനിറ്റ്) എങ്കിലും ചന്ദ്രൻ സഞ്ചരിക്കുന്ന നക്ഷത്രമാണ് ആ ദിവസത്തെ നക്ഷത്രമായി നിർണ്ണയിക്കുന്നത്.</div>
        `}
      </div>

      <!-- Nakshatram Details -->
      <div class="card nakshatram-detail-card">
        <div class="card-icon">🌟</div>
        <div class="card-label">നക്ഷത്ര വിവരങ്ങൾ / Nakshathram Details</div>
        ${d.nakshatramDetails.map(n => `
          <div class="nak-detail-row">
            <span class="nak-name">${n.nakshatram.ml}</span>
            <span class="nak-en">(${n.nakshatram.en})</span>
            <div class="nak-time">${n.start} – ${n.end}</div>
          </div>
        `).join('')}
      </div>

      <!-- Rashi -->
      <div class="card">
        <div class="card-icon">♈</div>
        <div class="card-label">രാശി / Rashi</div>
        <div class="card-value-ml">${d.rashi.ml}</div>
        <div class="card-value-en">${d.rashi.en}</div>
      </div>

      <!-- Yoga -->
      <div class="card">
        <div class="card-icon">🙏</div>
        <div class="card-label">യോഗം / Yoga</div>
        <div class="card-value-ml">${d.yoga.ml}</div>
        <div class="card-value-en">${d.yoga.en}</div>
      </div>

      <!-- Karana -->
      <div class="card">
        <div class="card-icon">📿</div>
        <div class="card-label">കരണം / Karana</div>
        <div class="card-value-ml">${d.karana.ml}</div>
        <div class="card-value-en">${d.karana.en}</div>
      </div>

      <!-- Kollavarsham Details -->
      <div class="card">
        <div class="card-icon">📅</div>
        <div class="card-label">കൊല്ലവർഷം / Kollavarsham</div>
        <div class="card-value-ml">${d.kollavarsham.monthMl} ${d.kollavarsham.day}</div>
        <div class="card-value-en">${d.kollavarsham.month} ${d.kollavarsham.day}, ${d.kollavarsham.year}</div>
      </div>

      <!-- Visheshadivasangal -->
      ${d.vishesham && d.vishesham.length > 0 ? `
      <div class="card vishesham-card">
        <div class="card-icon">🪔</div>
        <div class="card-label">വിശേഷദിവസങ്ങൾ / Special Days</div>
        ${d.vishesham.map(v => `
          <div class="vishesham-item">${v}</div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Timings -->
      <div class="card timings-card">
        <div class="card-icon">⏰</div>
        <div class="card-label">സമയങ്ങൾ / Timings</div>
        <div class="timing-row">
          <span class="timing-label">രാഹുകാലം</span>
          <span class="timing-value">${d.timings.rahukalam}</span>
        </div>
        <div class="timing-row">
          <span class="timing-label">യമകണ്ഡം</span>
          <span class="timing-value">${d.timings.yamagandam}</span>
        </div>
        <div class="timing-row">
          <span class="timing-label">ഗുളികകാലം</span>
          <span class="timing-value">${d.timings.gulika}</span>
        </div>
      </div>
    </div>
  `;
}

// Calendar functions
const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_ML = ['', 'ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മേയ്', 'ജൂൺ',
  'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'];
const WEEKDAY_HEADERS_ML = ['ഞായർ', 'തിങ്കൾ', 'ചൊവ്വ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി', 'ശനി'];

async function fetchMonthCalendar(year, month) {
  content.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <br>മാസ കലണ്ടർ ലോഡ് ചെയ്യുന്നു...
    </div>`;

  try {
    const res = await fetch(`/api/panchangam/month?year=${year}&month=${month}`);
    const data = await res.json();
    if (data.error) throw new Error(data.details || data.error);
    renderCalendar(data);
  } catch (err) {
    content.innerHTML = `<div class="loading" style="color:red;">Error: ${err.message}</div>`;
  }
}

function renderCalendar(data) {
  const { year, month, days } = data;
  const todayStr = formatDate(new Date());
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun

  // Weekday headers
  const headers = WEEKDAY_HEADERS_ML.map(d => `<div class="cal-weekday-header">${d}</div>`).join('');

  // Empty cells before first day
  let cells = '';
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells += '<div class="cal-cell cal-empty"></div>';
  }

  // Day cells
  for (const day of days) {
    const isToday = day.date === todayStr;
    const isSunday = day.gregorianDay === 'Sunday';
    const hasVishesham = day.vishesham && day.vishesham.length > 0;
    const classes = [
      'cal-cell',
      isToday ? 'cal-today' : '',
      day.isNakshatramLess ? 'cal-nak-less' : '',
      isSunday ? 'cal-sunday' : '',
      hasVishesham ? 'cal-vishesham' : ''
    ].filter(Boolean).join(' ');

    cells += `
      <div class="${classes}" onclick="switchToDay('${day.date}')">
        <div class="cal-greg-date">${day.day}</div>
        <div class="cal-kv-date">${day.kvMonthMl} ${day.kvDay}</div>
        <div class="cal-nak">${day.isNakshatramLess ? 'നക്ഷത്രം ഇല്ല' : day.nakshathramMl}</div>
        ${hasVishesham ? `<div class="cal-vishesham-tag">${day.vishesham.join(', ')}</div>` : ''}
      </div>`;
  }

  content.innerHTML = `
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="cal-nav-btn" onclick="changeMonth(-1)">◀ മുൻപ്</button>
        <h2>${MONTH_NAMES_ML[month]} ${year} / ${MONTH_NAMES[month]} ${year}</h2>
        <button class="cal-nav-btn" onclick="changeMonth(1)">പിന്നീട് ▶</button>
      </div>
      <div class="back-to-daily">
        <button onclick="switchToDailyView()">← ദിവസ വിവരങ്ങൾ / Daily View</button>
      </div>
      <div class="calendar-grid">
        ${headers}
        ${cells}
      </div>
    </div>`;
}

function changeMonth(delta) {
  calMonth += delta;
  if (calMonth > 12) { calMonth = 1; calYear++; }
  if (calMonth < 1) { calMonth = 12; calYear--; }
  fetchMonthCalendar(calYear, calMonth);
}

function switchToDay(dateStr) {
  isCalendarView = false;
  calToggle.textContent = '📅 മാസം';
  currentDate = new Date(dateStr + 'T12:00:00');
  datePicker.value = dateStr;
  fetchPanchangam(dateStr);
}

function switchToDailyView() {
  isCalendarView = false;
  calToggle.textContent = '📅 മാസം';
  fetchPanchangam(formatDate(currentDate));
}

// Event listeners
datePicker.addEventListener('change', () => {
  currentDate = new Date(datePicker.value + 'T12:00:00');
  fetchPanchangam(datePicker.value);
});

prevBtn.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() - 1);
  datePicker.value = formatDate(currentDate);
  fetchPanchangam(formatDate(currentDate));
});

nextBtn.addEventListener('click', () => {
  currentDate.setDate(currentDate.getDate() + 1);
  datePicker.value = formatDate(currentDate);
  fetchPanchangam(formatDate(currentDate));
});

todayBtn.addEventListener('click', () => {
  currentDate = new Date();
  datePicker.value = formatDate(currentDate);
  fetchPanchangam(formatDate(currentDate));
});

calToggle.addEventListener('click', () => {
  isCalendarView = !isCalendarView;
  if (isCalendarView) {
    calToggle.textContent = '📋 ദിവസം';
    calYear = currentDate.getFullYear();
    calMonth = currentDate.getMonth() + 1;
    fetchMonthCalendar(calYear, calMonth);
  } else {
    calToggle.textContent = '📅 മാസം';
    fetchPanchangam(formatDate(currentDate));
  }
});

// Initial load
fetchPanchangam(formatDate(currentDate));
