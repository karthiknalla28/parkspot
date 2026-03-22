# 🅿️ ParkSpot — Community Parking Finder

A real-time, community-driven parking availability app for the entire United States. Find free street parking near you, report spots, and help your neighbors.

Built by a neighbor, for neighbors — because driving around for 20 minutes looking for a spot is a problem we all share.

---

## 🌐 Live Site

👉 [karthiknalla28.github.io/parkspot](https://karthiknalla28.github.io/parkspot)

---

## 💡 The Problem

In dense neighborhoods like Everett and Malden, MA, finding street parking is a daily struggle. Residents drive around block after block with no way of knowing where a free spot might be. ParkSpot solves this by letting the community report and share parking availability in real time — for any street, anywhere in the United States.

---

## ✅ What's Built So Far

### Phase 1 — Webpage (Complete)
- Interactive map using **Leaflet.js** and **OpenStreetMap** — 100% free, no API key
- Color-coded parking pins — 🟢 Open, 🟡 Limited, 🔴 Full, ⚪ Expired
- Sidebar showing nearby streets with live spot counts

### Phase 2 — Search Anywhere (Complete)
- Smart autocomplete search as you type
- Instantly matches known streets from the live database
- Falls back to **Nominatim (OpenStreetMap)** to find any street in the US
- Keyboard navigation support — arrow keys + Enter
- No duplicate suggestions

### Phase 3 — Live Database + Community Reporting (Complete)
- **Supabase** database — real-time, free, no credit card
- Community reporting — anyone can report a free or taken spot
- New streets auto-added to database when first reported
- Exact spot count — reporter sets how many spots they see
- **Auto-expire** — reports older than 20 minutes automatically reset
- **Confidence scores** — more reports = higher trust score (1–10)
- **Confirmations** — users can confirm a report is still accurate
- **Comments** — optional notes like "2 spots near the stop sign"
- Total spots per street — editable by community
- Refresh button + auto-refresh every 60 seconds with countdown

### Phase 4 — Code Quality (Complete)
- Split from single 940-line file into clean 3-file structure:
  - `index.html` — structure only
  - `style.css` — styles only
  - `app.js` — logic only

---

## 🗺️ Coverage

- **Search**: Any street, anywhere in the United States via Nominatim
- **Live data**: Any street ever reported by a community member
- **Started in**: Everett & Malden, MA — expanding organically as users report

---

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Free |
| Map | Leaflet.js + OpenStreetMap | Free forever |
| Street search | Nominatim API | Free forever |
| Database | Supabase (PostgreSQL) | Free tier |
| Hosting | GitHub Pages | Free forever |

---

## 🗄️ Database Schema

**Table: `streets`**

| Column | Type | Description |
|---|---|---|
| `id` | int8 | Auto-generated primary key |
| `name` | text | Street name |
| `city` | text | City name |
| `lat` | float8 | Latitude coordinate |
| `lng` | float8 | Longitude coordinate |
| `spots` | int4 | Current free spots |
| `total_spots` | int4 | Total spots on street |
| `status` | text | green / yellow / red / expired |
| `confidence` | int4 | Trust score 1–10 |
| `confirmations` | int4 | Number of confirmations |
| `comment` | text | Optional community note |
| `last_updated` | timestamptz | Timestamp of last report |

---

## 🏗️ Project Structure
```
parkspot/
├── index.html   ← Page structure (80 lines)
├── style.css    ← All styling (200 lines)
└── app.js       ← All JavaScript logic (350 lines)
```

---

## 🚧 Roadmap

- [x] Phase 1 — Interactive map and webpage
- [x] Phase 2 — Smart autocomplete search for any US street
- [x] Phase 3 — Live Supabase database with community reporting
- [x] Phase 4 — Clean 3-file code structure
- [x] Phase 5 — Mobile-friendly layout for use in your car
- [ ] Phase 6 — Launch to Everett & Malden community (Nextdoor, Facebook groups)
- [ ] Phase 7 — User accounts and personal parking history
- [ ] Phase 8 — Push notifications when a spot opens near you

---

## 👨‍💻 Author

**Karthik Nalla** — built this as a personal project to solve a real parking problem in Everett, MA.
Started from zero coding experience. Learning HTML, CSS, JavaScript, and databases by building something real.

---

## 🤝 Contributing

This is a personal learning project for now. Once Phase 5 is complete and the app is launched to the community, contributions and street data from other residents will be welcome!

---


