# Deployment guide

## Vercel

1. Push repo to GitHub
2. Import project in Vercel
3. Set environment variables from `.env.example`
4. Add domains:
   - `legacy.blackforge.ai` (marketing + scout)
   - `command.legacy.blackforge.ai` (Command OS — middleware rewrites to `/command-os`)

## Supabase

1. Create project, run `supabase/migrations/001_schema.sql` and `002_rls.sql`
2. Enable Realtime on `leads` table
3. Run `npm run seed` with service role key

## Pre-demo checklist

- [ ] Staff logged in at `/command-os/leads` (Tab B)
- [ ] Marketing open at `/locations/mesa` (Tab A)
- [ ] Verify lead form → kanban animation
- [ ] Test 7 cached NL queries on Command Center
- [ ] Tyler Chen retention → pre-written message
- [ ] Scout login → search Marcus Johnson
