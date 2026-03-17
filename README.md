# 🅿️ ParkSpot — Greater Boston Parking Finder

A community-driven, real-time parking availability app for Greater Boston neighborhoods including Everett, Malden, Somerville, Cambridge, and Boston.

Built by a neighbor, for neighbors — because driving around for 20 minutes looking for a spot is a problem we all share.

---

## 🌐 Live Site

👉 [karthiknalla28.github.io/parkspot](https://karthiknalla28.github.io/parkspot)

---

## 💡 The Problem

In dense neighborhoods like Everett and Malden, MA, finding street parking is a daily struggle. Residents drive around block after block with no way of knowing where a free spot might be. ParkSpot solves this by letting the community report and share parking availability in real time.

---

## ✅ What's Built So Far

### Phase 1 — Webpage (Complete)
- Interactive map of Greater Boston using **Leaflet.js** and **OpenStreetMap** (100% free, no API key)
- Color-coded parking pins on the map — 🟢 Open, 🟡 Limited, 🔴 Full
- Sidebar showing nearby streets with live spot counts
- "Report a spot" buttons for community updates

### Phase 2 — Search Anywhere (Complete)
- Smart autocomplete search as you type
- Instantly matches known streets from local data
- Falls back to **Nominatim (OpenStreetMap)** to find any street in Massachusetts
- Keyboard navigation support (arrow keys + Enter)
- Works for any street across Greater Boston and beyond

---

## 🗺️ Coverage

Currently has seeded data for these streets:

| Street | City | Status |
|---|---|---|
| Ferry St | Everett | 🟢 Open |
| Elm St | Everett | 🟢 Open |
| Broadway | Everett | 🟡 Limited |
| Nichols St | Everett | 🔴 Full |
| Newbury St | Boston | 🔴 Full |
| Hanover St | Boston | 🟡 Limited |
| Mass Ave | Cambridge | 🟢 Open |
| Broadway | Somerville | 🟢 Open |
| Washington St | Malden | 🟢 Open |
| Central Ave | Malden | 🟡 Limited |

> Any street in Massachusetts can be searched via the autocomplete — the above are the only streets with parking data so far. Real community data comes in Phase 3.

---

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Free |
| Map | Leaflet.js + OpenStreetMap | Free forever |
| Street search | Nominatim API | Free forever |
| Hosting | GitHub Pages | Free forever |
| Database (coming) | Firebase Firestore | Free tier |

---

## 🚧 Roadmap

- [x] Phase 1 — Build the webpage and map
- [x] Phase 2 — Smart search for any street in Greater Boston
- [ ] Phase 3 — Connect Firebase database for real-time community reports
- [ ] Phase 4 — Auto-expire old reports (spots go stale after 20 mins)
- [ ] Phase 5 — Mobile-friendly layout for use while sitting in your car
- [ ] Phase 6 — Launch to Everett & Malden community (Nextdoor, Facebook groups)

---

## 🏗️ Project Structure
```
parkspot/
└── index.html    ← entire app lives here for now
```

---

## 👨‍💻 Author

**Karthik Nalla** — built this as a personal project to solve a real parking problem in Everett, MA.  
Started from zero coding experience. Learning HTML, CSS, JavaScript, and Firebase by building something real.

---

## 🤝 Contributing

This is a personal learning project for now. Once Phase 3 (database) is complete, contributions and street data from other Boston-area residents will be welcome!

---

*Last updated: Phase 2 complete — search + autocomplete live*
