# Malayalam Panchangam (മലയാളം പഞ്ചാംഗം)

A fully standalone Malayalam Panchangam (Hindu calendar) web application with accurate astronomical calculations based on NASA/Moshier ephemeris algorithms. No external astronomical APIs or heavy calendar libraries required — all calculations are done in pure JavaScript.

**Default Location:** Kerala, India (11.07°N, 76.28°E)

---

## Features

### Daily Panchangam
- **Gregorian Date & Weekday** — English and Malayalam (ഞായർ, തിങ്കൾ, etc.)
- **Kollavarsham Date** — Malayalam Era calendar (year, month, day) with both Malayalam and English month names
- **Nakshathram (Birth Star)** — Day's nakshathram determined by the traditional **6 Nazhika rule** (sunrise + 162 minutes checkpoint)
- **Nakshathram-less Day Detection** — Identifies days where no nakshathram qualifies (നക്ഷത്രം ഇല്ലാത്ത ദിവസം) with detailed Malayalam explanation
- **Nakshathram Transition Details** — Full day nakshathram timeline with start/end times
- **Tithi** — Lunar day with Shukla/Krishna paksha
- **Rashi** — Solar zodiac sign (based on sidereal sun position)
- **Yoga** — Sun-Moon angular relationship (27 yogas)
- **Karana** — Half-tithi subdivision (11 karanas)
- **Sunrise & Sunset** — Accurate times with iterative astronomical calculation
- **Rahukalam, Yamagandam, Gulika** — Inauspicious time periods based on weekday

### Monthly Calendar View
- Full month grid with 7-column (Sunday–Saturday) layout
- Each cell displays: Gregorian date, Kollavarsham date, day's nakshathram
- Today highlighted, Sundays in red, nakshathram-less days in orange
- Special days (visheshadivasangal) shown as tags
- Click any day to navigate to detailed daily view
- Month navigation (previous/next)

### Visheshadivasangal (Special Days & Festivals)

**Major Kerala Festivals:**
- **Vishu (വിഷു)** — Mesha Sankranti with sunrise-based rule (if Sankranti is before sunrise, that day is Vishu; if after sunrise, next day)
- **Onam (ഓണം)** — Thiruvonam nakshathram in Chingam (1st, 2nd, 3rd Onam)
- **Sivarathri (മഹാശിവരാത്രി)** — Krishna Chaturdashi in Kumbham
- **Navaratri (നവരാത്രി)** — 9 days, Shukla Pratipada to Navami in Kanni-Thulam transition
- **Vijayadashami (വിജയദശമി)** — Shukla Dashami
- **Deepavali (ദീപാവലി)** — Krishna Amavasya in Thulam
- **Thiruvathira (തിരുവാതിര)** — Thiruvathira nakshathram in Dhanu

**Other Festivals:**
- Vinayaka Chaturthi (വിനായക ചതുർത്ഥി)
- Ashtami Rohini / Krishna Jayanthi (അഷ്ടമിരോഹിണി)
- Makara Sankranti (മകരസംക്രാന്തി) & Makaravilakku (മകരവിളക്ക്)
- Karkidaka Vavu (കർക്കടക വാവ്)
- Mandala Pooja (മണ്ഡലപൂജ) & Mandala Kaalam
- Thaipooyam (തൈപ്പൂയം)
- Attukal Pongala (ആറ്റുകാൽ പൊങ്കാല)
- Maha Bharani (മഹാഭരണി) & Meena Bharani (മീനഭരണി)
- Guruvayur Ekadashi (ഗുരുവായൂർ ഏകാദശി)
- Vaikuntha Ekadashi (വൈകുണ്ഠ ഏകാദശി)
- Thrikarthika (തൃക്കാർത്തിക)
- Durgashtami (ദുർഗ്ഗാഷ്ടമി) & Saraswati Pooja (സരസ്വതീ പൂജ)
- Viswakarma Dinam (വിശ്വകർമ്മ ദിനം)
- Chingam 1 / Malayalam New Year (ചിങ്ങം 1)

**Tithi-based Recurring Events:**
- Ekadashi (ഏകാദശി)
- Amavasya (അമാവാസി)
- Pournami (പൗർണ്ണമി)
- Pradosham (പ്രദോഷം)

**Special Weekly Events:**
- Muppettu Vyazham (മുപ്പെട്ടുവ്യാഴം) — First Thursday of Malayalam month
- First Saturday of Malayalam month

---

## Astronomical Engine

The core engine (`src/panchang-engine.js`) is a **zero-dependency** astronomical calculator featuring:

- **Moon Longitude** — ~80 perturbation correction terms (NASA/Moshier ephemeris)
- **Sun Longitude** — Equation of center with periodic corrections
- **Lahiri Ayanamsa** — Sidereal (Nirayana) coordinate conversion
- **Sunrise/Sunset** — Iterative calculation with atmospheric refraction
- **Julian Date** conversions for all astronomical computations
- **Sankranti Detection** — Newton's method iteration for exact solar transition times
- **Malayalam (Kollavarsham) Date** — Computed from solar Sankranti positions, not lookup tables

### Nakshathram Selection Rule (6 Nazhika)
The day's nakshathram is determined by checking the Moon's position at **sunrise + 162 minutes** (6 Nazhika ≈ 2 hours 24 minutes). If the same nakshathram appears at this checkpoint on two consecutive days, the first day is marked as a nakshathram-less day.

### Vishu Calculation (Sunrise-based)
- If Mesha Sankranti occurs **before** sunrise → that day is Vishu
- If Mesha Sankranti occurs **after** sunrise → next day is Vishu
- Follows the Kerala panchangam's **സൂര്യോദയാധിഷ്ഠിത ദിനക്രമം** (sunrise-based day system)

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js + Express |
| Frontend | Plain HTML, CSS, JavaScript |
| Astronomical Engine | Pure JavaScript (no external libraries) |
| Styling | Kerala temple theme (gold, maroon, green) |
| Fonts | Noto Sans Malayalam, Playfair Display |
| Language | Bilingual — Malayalam + English |

---

## Project Structure

```
Ml-panchangam/
├── server.js                    # Express API server
├── src/
│   ├── panchang-engine.js       # Astronomical calculation engine
│   └── panchangam.js            # API layer (formats engine output)
├── public/
│   ├── index.html               # Main HTML page
│   ├── css/
│   │   └── style.css            # Kerala temple themed styles
│   └── js/
│       └── app.js               # Frontend logic (daily + calendar views)
├── package.json
└── README.md
```

---

## API Endpoints

### `GET /api/panchangam`

Returns full panchangam data for a single day.

**Query Parameters:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| `date` | Today | Date in `YYYY-MM-DD` format |
| `lat` | 11.0745 | Latitude |
| `lng` | 76.2824 | Longitude |

**Response:**
```json
{
  "gregorian": { "date": "2026-03-01", "day": "Sunday" },
  "kollavarsham": { "year": 1201, "month": "Kumbham", "monthMl": "കുംഭം", "day": 17 },
  "weekday": { "en": "Sunday", "ml": "ഞായർ" },
  "nakshathram": { "en": "Aayilyam", "ml": "ആയില്യം" },
  "isNakshatramLess": false,
  "nakshatramDetails": [
    { "nakshatram": { "en": "Aayilyam", "ml": "ആയില്യം" }, "start": "...", "end": "..." }
  ],
  "tithi": { "name": "Tritiya", "nameMl": "തൃതീയ", "paksha": "Shukla", "pakshaMl": "ശുക്ല" },
  "rashi": { "en": "Kumbha (Aquarius)", "ml": "കുംഭം" },
  "yoga": { "en": "Shobhana", "ml": "ശോഭനം" },
  "karana": { "en": "Balava", "ml": "ബാലവ" },
  "sunrise": "6:43 AM",
  "sunset": "6:31 PM",
  "vishesham": ["നാഗപൂജ", "പ്രദോഷം"],
  "timings": {
    "rahukalam": "4:58 PM – 6:31 PM",
    "yamagandam": "12:18 PM – 1:50 PM",
    "gulika": "3:25 PM – 4:58 PM"
  }
}
```

### `GET /api/panchangam/month`

Returns lightweight panchangam data for all days in a month (used by the calendar view).

**Query Parameters:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| `year` | Current year | Year |
| `month` | Current month | Month (1-12) |
| `lat` | 11.0745 | Latitude |
| `lng` | 76.2824 | Longitude |

**Response:**
```json
{
  "year": 2026,
  "month": 3,
  "days": [
    {
      "date": "2026-03-01",
      "day": 1,
      "gregorianDay": "Sunday",
      "weekdayMl": "ഞായർ",
      "kvMonth": "Kumbham",
      "kvMonthMl": "കുംഭം",
      "kvDay": 17,
      "kvYear": 1201,
      "nakshathram": "Aayilyam",
      "nakshathramMl": "ആയില്യം",
      "isNakshatramLess": false,
      "vishesham": ["നാഗപൂജ", "പ്രദോഷം"]
    }
  ]
}
```

---

## Installation & Usage

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open in browser
# http://localhost:3000
```

### Dependencies

Only two runtime dependencies:
- `express` — Web server
- `cors` — Cross-origin support

All astronomical calculations are handled by the built-in engine with **zero external dependencies**.

---

## Frontend

- **Mobile responsive** — optimized for phones with proper touch targets (44px minimum)
- **Daily View** — summary card, sunrise/sunset, all panchangam elements in card grid
- **Monthly Calendar** — 7-column grid, click-to-navigate, special day tags
- **Date Navigation** — date picker, previous/next day buttons, today button
- **Kerala Temple Aesthetic** — gold (#D4A017), maroon (#800020), dark green (#1B5E20) color scheme

---

## License

MIT
