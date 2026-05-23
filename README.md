# Legacy Sports Complex — Demo

High-fidelity demo for Legacy Sports Complex: public marketing site, **Legacy Command** OS, and **Scout Portal**.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the marketing site.

### Demo credentials

| Surface | URL | Email | Password |
|---------|-----|-------|----------|
| Legacy Command (staff) | [/login](http://localhost:3000/login) → `/command-os` | `amber@legacy.demo` | `LegacyDemo2026!` |
| Scout Portal | [/scout/login](http://localhost:3000/scout/login) | `mike.chen@scout.demo` | `LegacyDemo2026!` |

### Production routing

- Marketing: `legacy.blackforge.ai`
- Command OS: `command.legacy.blackforge.ai` (rewrites to `/command-os/*`)
- Scout: `legacy.blackforge.ai/scout/*`

## Demo path checklist

1. **Lead handoff** — Submit form at `/locations/mesa`, see lead appear in `/command-os/leads`
2. **NL query** — Ask "which athletes are at risk of churning this week" on Command Center
3. **Athlete profile** — `/command-os/athletes/{marcus-id}`
4. **At-risk flow** — `/command-os/retention` → Tyler Chen → draft message → Send
5. **Location switcher** — Top nav on Command OS
6. **Scout Portal** — Search QBs with 40 &lt; 4.7, view Marcus Johnson

## Supabase setup (optional)

1. Create a Supabase project
2. Run migrations in `supabase/migrations/`
3. Enable Realtime on `leads` table
4. Copy `.env.example` → `.env.local` and fill keys
5. `npm run seed`

Without Supabase, the app uses in-memory demo data (fully functional for screen-share).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run seed` — seed Supabase + export `content/public-athletes.json`

## Stack

Next.js 16 · Supabase Auth + Postgres · Gemini AI · Tailwind CSS · Recharts
