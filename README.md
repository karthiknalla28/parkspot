# 🅿️ ParkSpot — Community Parking Finder

A real-time, community-driven parking availability app for the entire United States.
Find free street parking near you, report spots, and help your neighbors.

Built by a neighbor, for neighbors — because driving around for 20 minutes looking
for a spot is a problem we all share.

---

## 🌐 Live Site

👉 [karthiknalla28.github.io/parkspot](https://karthiknalla28.github.io/parkspot)

### 📱 Install as an App (iPhone)
1. Open Safari and go to the link above
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **"Add"**

ParkSpot will appear on your home screen like a native app — no App Store needed!

---

## 💡 The Problem

In dense neighborhoods like Everett and Malden, MA, finding street parking is a
daily struggle. Residents drive around block after block with no way of knowing
where a free spot might be.

ParkSpot solves this by letting the community report and share parking availability
in real time — for any street, anywhere in the United States.

---

## ✅ What's Built

### Phase 1 — Interactive Map
- Interactive map using **Leaflet.js** and **OpenStreetMap** — 100% free, no API key
- Color-coded parking pins — 🟢 Open, 🟡 Limited, 🔴 Full, ⚪ Expired
- Sidebar showing nearby streets with live spot counts
- Click the **ParkSpot logo** to refresh data instantly

### Phase 2 — Search Anywhere in the US
- Smart autocomplete search as you type
- Instantly matches known streets from the live database
- Falls back to **Nominatim (OpenStreetMap)** to find any street in the US
- No duplicate streets — smart name matching (Ferry St = Ferry Street)
- Keyboard navigation — arrow keys + Enter

### Phase 3 — Live Database + Community Reporting
- **Supabase** PostgreSQL database — real-time, free, no credit card
- Community reporting — anyone can report a free or taken spot
- New streets auto-added to database when first reported
- **Save spot count** — set exactly how many spots you see
- **Auto-expire** — reports older than 20 minutes automatically reset
- **Confidence scores** — more reports = higher trust score (1–10)
- **Confirmations** — users can confirm a report is still accurate
- **Comments** — optional notes like "2 spots near the stop sign"
- Total spots per street — editable by community
- Auto-refresh every 60 seconds with countdown timer

### Phase 4 — Clean Code Structure
- Split from one 940-line file into clean 3-file structure
- `index.html` — structure only
- `style.css` — all styling
- `app.js` — all JavaScript logic

### Phase 5 — Beautiful Mobile Layout
- Full-screen map on mobile
- Google Maps-style bottom sheet that slides up smoothly
- "← Map" button to collapse back to the map
- Big easy-to-tap buttons optimized for one-handed use
- Tested on iPhone 17 Air
- Smooth animations and transitions throughout

### Phase 6 — PWA (Progressive Web App)
- Installable on iPhone and Android home screen
- Works with weak signal — static files cached offline
- No App Store needed
- Feels like a native app — full screen, no browser bar
- Custom green P icon on home screen

---

## 🗺️ Coverage

- **Search:** Any street, anywhere in the United States via Nominatim
- **Live data:** Any street ever reported by a community member
- **Started in:** Everett & Malden, MA — expanding organically as users report

---

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Free |
| Map | Leaflet.js + OpenStreetMap | Free forever |
| Street search | Nominatim API | Free forever |
| Database | Supabase (PostgreSQL) | Free tier |
| Hosting | GitHub Pages | Free forever |
| PWA | Service Worker + Web Manifest | Free forever |

**Total monthly cost: $0**

---

## 🗄️ Database Schema

**Table: `streets`**

| Column | Type | Default | Description |
|---|---|---|---|
| `id` | int8 | auto | Primary key |
| `name` | text | — | Street name |
| `city` | text | — | City name |
| `lat` | float8 | — | Latitude |
| `lng` | float8 | — | Longitude |
| `spots` | int4 | — | Current free spots |
| `total_spots` | int4 | 10 | Total capacity |
| `status` | text | — | green / yellow / red / expired |
| `confidence` | int4 | 1 | Trust score 1–10 |
| `confirmations` | int4 | 0 | Confirmation count |
| `comment` | text | — | Community note |
| `last_updated` | timestamptz | — | Last report time |

---

## 🏗️ Project Structure
```
parkspot/
├── index.html          ← Page structure
├── style.css           ← All styling + mobile layout
├── app.js              ← All JavaScript logic
├── manifest.json       ← PWA configuration
├── service-worker.js   ← Offline caching
├── README.md           ← This file
├── supabase.md         ← DB docs (no keys)
├── .gitignore          ← Keeps secrets local
└── icons/
    ├── icon-192.png    ← App icon (small)
    └── icon-512.png    ← App icon (large)
```

---

## 🚧 Roadmap

- [x] Phase 1 — Interactive map and webpage
- [x] Phase 2 — Smart autocomplete search for any US street
- [x] Phase 3 — Live Supabase database with community reporting
- [x] Phase 4 — Clean 3-file code structure
- [x] Phase 5 — Beautiful mobile layout with bottom sheet
- [x] Phase 6 — PWA — installable on iPhone and Android
- [ ] Phase 7 — Launch to Everett & Malden community
- [ ] Phase 8 — Push notifications when a spot opens near you
- [ ] Phase 9 — User accounts and personal parking history
- [ ] Phase 10 — Analytics dashboard — peak hours, busiest streets

---

## 📖 How It Works
```
User searches "Ferry St, Everett"
          ↓
App checks local database first (instant)
          ↓
Falls back to Nominatim API if not found
          ↓
User sees colored pin on map + spot count
          ↓
User reports "I just freed a spot"
          ↓
Supabase database updates instantly
          ↓
Everyone's map refreshes within 60 seconds
          ↓
Report expires automatically after 20 minutes
```

---

## 👨‍💻 Author

**Karthik Nalla** — built this as a personal project to solve a real parking
problem in Everett, MA.

Started from **zero coding experience**. Learned HTML, CSS, JavaScript,
APIs, databases, mobile layout, and PWA by building something real that
solves a problem I face every day.

**Live at:** [karthiknalla28.github.io/parkspot](https://karthiknalla28.github.io/parkspot)

---

## 🤝 Contributing

This is a personal learning project. Once it launches to the community,
contributions and street data from other residents are welcome!

---

*Last updated: Phase 6 complete — PWA installed on iPhone, works offline*