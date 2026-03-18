# Supabase Configuration

## Project Details
- **Region:** US East (North Virginia)
- **Project URL:** stored in app.js

## API Keys
- **Keys are stored in `app.js`** — do not commit real keys to public repos
- For production, move keys to environment variables

## Table: streets

| Column | Type | Default | Description |
|---|---|---|---|
| id | int8 | auto | Primary key |
| name | text | null | Street name |
| city | text | null | City name |
| lat | float8 | null | Latitude coordinate |
| lng | float8 | null | Longitude coordinate |
| spots | int4 | null | Current free spots |
| total_spots | int4 | 10 | Total spots on street |
| status | text | null | green / yellow / red / expired |
| confidence | int4 | 1 | Trust score 1–10 |
| confirmations | int4 | 0 | Number of confirmations |
| comment | text | null | Optional community note |
| last_updated | timestamptz | null | Timestamp of last report |

## Recreate Table (SQL)
Run this in Supabase SQL Editor to recreate the table from scratch:
```sql
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
```

## Security Notes
- RLS (Row Level Security) is DISABLED — required for community reporting
- Never commit real API keys to public GitHub repos
- Publishable key is safe for client-side use but keep it out of version control

## Free Tier Limits
| Resource | Limit |
|---|---|
| Database rows | 50,000 |
| Storage | 500 MB |
| Bandwidth | 2 GB/month |
| API requests | Unlimited |

## Important Notes
- Auto-expire: spots older than 20 mins reset to expired in `app.js`
- All writes go through the Supabase REST API via the JS SDK
- No backend server needed — frontend talks directly to Supabase
```
