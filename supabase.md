# Supabase Configuration

## Project Details
- **Project URL:** https://tvuwlxmgpauubuitqgbd.supabase.co
- **Region:** US East (North Virginia)
- **Project ID:** tvuwlxmgpauubuitqgbd

## API Keys
- **Publishable key:** sb_publishable_Z70iI8GKpj_2PU5T8BiaOQ_DvGXBg43
- **Secret key:** (never share this — find it in Supabase dashboard only)

## Table: streets

| Column | Type | Default |
|---|---|---|
| id | int8 | auto |
| name | text | null |
| city | text | null |
| lat | float8 | null |
| lng | float8 | null |
| spots | int4 | null |
| total_spots | int4 | 10 |
| status | text | null |
| confidence | int4 | 1 |
| confirmations | int4 | 0 |
| comment | text | null |
| last_updated | timestamptz | null |

## Recreate Table (SQL)
Run this in Supabase SQL Editor to recreate the table from scratch:

CREATE TABLE streets (
  id            bigserial PRIMARY KEY,
  name          text,
  city          text,
  lat           float8,
  lng           float8,
  spots         int4,
  total_spots   int4 DEFAULT 10,
  status        text,
  confidence    int4 DEFAULT 1,
  confirmations int4 DEFAULT 0,
  comment       text,
  last_updated  timestamptz
);

## Important Notes
- RLS (Row Level Security) is DISABLED — required for community reporting
- Free tier limits: 50,000 rows, 500MB storage, 2GB bandwidth/month
- Auto-expire: spots older than 20 mins reset to expired in app.js
```

---

**3 — Add `supabase.md` to `.gitignore`**

Wait — actually **don't push `supabase.md` to GitHub** because it contains your API keys. Create a `.gitignore` file in your project folder:

1. Create new file → name it `.gitignore`
2. Add this content:
```
supabase.md
```

This tells GitHub to ignore that file so your keys stay private.

---

**Your project folder should now look like this:**
```
parkspot/
├── index.html      ← push to GitHub ✅
├── style.css       ← push to GitHub ✅
├── app.js          ← push to GitHub ✅
├── README.md       ← push to GitHub ✅
├── .gitignore      ← push to GitHub ✅
└── supabase.md     ← keep LOCAL only 🔒
