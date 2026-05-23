# Legacy Sports Complex — Demo Build Engineering Specification

**Purpose:** Build a screen-share demo for Tuesday's meeting with Legacy Sports Complex leadership (Amber Chovanic, Steve Tucker, Dustin). Two surfaces: a new public website and an operating system ("Legacy Command"). Both must look and feel like production software. Format is screen-share walkthrough — interactions can be choreographed but must be real, not faked.

**Build window:** ~72 hours (Saturday through Monday evening). 2–3 engineers + AI-assisted development.

**Non-negotiable demo moments:**
1. Lead-capture handoff from public site → OS Comms Hub (live, real-time)
2. Natural-language Command Center query
3. Unified athlete profile with measurables, wearables, AI summary
4. At-risk member auto-detection + AI-drafted re-engagement message
5. Multi-location switcher (5 locations, one login)
6. Scout Portal showing data-as-asset story

---

## 1. Architecture overview

### Application topology

Single repository, single deployable web application, three routed surfaces sharing one database and one design system:

- **`(marketing)`** — public-facing website, no auth required
- **`(app)`** — Legacy Command OS, auth-gated, role: legacy staff
- **`(scout)`** — Scout Portal, separately auth-gated, role: external scout, branded distinctly from main OS

A single database backs all three. Row-level security enforces what each role sees.

### Stack guidance (not prescriptive)

The team should choose tools they can move fastest on. Reasonable defaults:

- **Frontend framework:** any modern React-based meta-framework with file-based routing, server components, and good SSR. Next.js is the obvious choice; Remix or Astro would also work.
- **Database:** Postgres. Managed (Supabase, Neon, or similar) is strongly preferred over self-hosted given the timeline.
- **Auth:** whatever ships with the database provider, or a hosted auth service. Don't roll your own.
- **Realtime:** the database provider's realtime channel (for the lead-capture handoff demo moment). Fallback: short-poll every 2s on the Comms Hub view during the demo.
- **AI provider:** any frontier model with tool/function calling and a fast tokens-per-second rate. The natural-language layer needs sub-3-second response times for the demo to feel magical. Pre-cache scripted queries regardless of provider.
- **Vector search:** pgvector extension on the same Postgres instance. Avoid introducing a separate vector DB for this timeline.
- **Styling:** utility-CSS framework + headless component library. Tailwind + shadcn/ui or equivalent.
- **Charts:** any charting library with good React bindings (Recharts, Visx, Tremor). Whichever the team has used before.
- **Hosting:** edge-deployed serverless (Vercel, Netlify, Cloudflare Pages). One-click deploys matter for the iteration cadence.
- **Domain:** stage at a subdomain that looks real on screen-share, e.g. `legacy.blackforge.ai`.

### What this is NOT

This is not a production system. It is a high-fidelity demo. Decisions optimize for: (a) visual polish, (b) demo-path reliability, (c) speed of build. Things that don't serve the demo path (multi-tenant isolation, audit logs, real billing integration, real wearable APIs, accessibility beyond the basics, internationalization) are explicitly out of scope.

---

## 2. Data model

### Tables

**`locations`**
- `id` uuid primary key
- `name` text — Phoenix, Mesa, Gilbert, Scottsdale, Chandler
- `address` text
- `lat`, `lng` numeric
- `square_footage` integer
- `amenities` text[] — turf, weight room, recovery, etc.
- `photo_urls` text[]
- `phone` text
- `hours` jsonb — day-of-week schedule

Seed: exactly 5 locations.

**`athletes`**
- `id` uuid primary key
- `first_name`, `last_name` text
- `date_of_birth` date
- `sport` text — football, basketball, baseball, soccer, multi
- `position` text — nullable
- `gender` text
- `graduation_year` integer
- `school` text
- `gpa` numeric
- `home_location_id` uuid → locations
- `photo_url` text — use generated portrait service (e.g. thispersondoesnotexist style)
- `parent_name`, `parent_email`, `parent_phone` text
- `program_id` uuid → programs
- `enrollment_date` date
- `status` text — active, paused, at_risk, churned
- `ai_summary` text — pre-generated narrative summary (1–2 paragraphs) used in profile right-rail
- `scout_visible` boolean — controls Scout Portal visibility
- `recruit_status` text — uncommitted, considering, committed, signed
- `created_at`, `updated_at` timestamptz

Seed: 150 athletes. 5 designated "hero" athletes (see §6) with richer history.

**`measurables`**
- `id` uuid primary key
- `athlete_id` uuid → athletes
- `recorded_at` timestamptz
- `metric` text — forty_yard, ten_yard_split, vertical, broad_jump, bench_max, squat_max, wingspan, height, weight
- `value` numeric
- `unit` text — seconds, inches, pounds
- `is_pr` boolean — auto-flagged
- `recorded_by_coach_id` uuid → coaches

Seed: 12 months of measurables per athlete, taken roughly every 4–6 weeks, with realistic progression curves. Hero athletes get visible improvement trends.

**`attendance`**
- `id` uuid primary key
- `athlete_id` uuid → athletes
- `session_id` uuid → sessions
- `checked_in_at` timestamptz
- `status` text — attended, no_show, late_cancel

Seed: 12 months of attendance per active athlete, ~2–3 sessions/week with realistic gaps. Tyler Chen (at-risk hero) has a 6-day gap in the most recent week.

**`sessions`** (scheduled classes/training blocks)
- `id` uuid primary key
- `location_id` uuid → locations
- `coach_id` uuid → coaches
- `program_id` uuid → programs
- `starts_at`, `ends_at` timestamptz
- `room` text
- `capacity` integer

Seed: full 12-month calendar across all 5 locations.

**`coaches`**
- `id` uuid primary key
- `first_name`, `last_name` text
- `email` text
- `photo_url` text
- `bio` text
- `specialties` text[]
- `primary_location_id` uuid → locations
- `voice_sample` text — 200-word writing sample used to prime AI re-engagement message generation in their tone

Seed: 8 coaches across 5 locations.

**`programs`**
- `id` uuid primary key
- `name` text — Youth Performance, HS Combine Prep, College Recruit Track, Adult Performance, Team Training
- `description` text
- `monthly_price` numeric
- `target_age_min`, `target_age_max` integer

Seed: 5 programs.

**`coach_notes`**
- `id` uuid primary key
- `athlete_id` uuid → athletes
- `coach_id` uuid → coaches
- `created_at` timestamptz
- `content` text
- `tags` text[]
- `embedding` vector(1536) — pgvector, for semantic search

Seed: 5–10 notes per active athlete; hero athletes get 20+ each.

**`wearable_data`**
- `id` uuid primary key
- `athlete_id` uuid → athletes
- `recorded_at` timestamptz
- `source` text — whoop, apple_watch, garmin (mocked)
- `metric` text — sleep_hours, hrv, strain, recovery_score, resting_hr
- `value` numeric

Seed: 90 days of daily wearable data for hero athletes only. Other athletes: empty (UI shows "Not connected — invite to link wearable").

**`video_clips`**
- `id` uuid primary key
- `athlete_id` uuid → athletes
- `title` text
- `thumbnail_url` text
- `video_url` text — stock training footage from a free CDN; same 3–4 clips reused
- `ai_tags` text[] — pre-generated tags like "hip mobility", "lateral cut", "explosive first step"
- `recorded_at` timestamptz

Seed: 3–4 clips per hero athlete. Other athletes: 0–1.

**`leads`**
- `id` uuid primary key
- `created_at` timestamptz
- `source` text — website, referral, walk_in, scout
- `first_name`, `last_name` text
- `email`, `phone` text
- `athlete_name` text — when a parent submits for their child
- `athlete_age` integer
- `interested_program_id` uuid → programs
- `interested_location_id` uuid → locations
- `notes` text
- `status` text — new, contacted, scheduled, converted, lost
- `assigned_coach_id` uuid → coaches

Seed: 200 leads at various funnel stages, weighted toward recent dates.

**`messages`** (unified Comms Hub)
- `id` uuid primary key
- `created_at` timestamptz
- `channel` text — sms, email, in_app
- `direction` text — inbound, outbound
- `from_party` text — athlete, parent, coach, system, lead
- `to_party` text
- `athlete_id` uuid nullable → athletes
- `lead_id` uuid nullable → leads
- `subject` text nullable
- `body` text
- `read_at` timestamptz nullable
- `ai_generated` boolean default false

Seed: full conversation threads for hero athletes and recent leads. Mix of inbound and outbound.

**`payments`**
- `id` uuid primary key
- `athlete_id` uuid → athletes
- `amount` numeric
- `status` text — succeeded, failed, pending
- `processed_at` timestamptz
- `description` text

Seed: 12 months of monthly billing per active athlete. Inject 8 failed payments in the current week for the Command Center insight card.

**`scout_users`**
- `id` uuid primary key
- `email` text
- `name` text
- `organization` text — "Sun Devil State University", "Copper Canyon University", etc.
- `role` text — head_coach, assistant_coach, recruiter
- `interested_positions` text[]
- `geographic_focus` text

Seed: 1 demo scout login (Coach Mike Chen, Sun Devil State University) + 5 background scout accounts visible in Legacy's "active scouts viewing your data" panel.

**`saved_searches`** (Scout Portal)
- `id` uuid primary key
- `scout_user_id` uuid → scout_users
- `name` text
- `filters` jsonb — position, age range, location radius, measurable thresholds, GPA min

### Row-level security policies

- Legacy staff: full read across all rows except `scout_users`
- Scout users: read-only on `athletes` where `scout_visible = true`, read-only on `measurables` for visible athletes, no read on `coach_notes`, `payments`, `messages`
- Public (marketing): no DB access except via lead-capture API endpoint

---

## 3. AI layer architecture

### Natural-language Command Center

**Endpoint:** `POST /api/ai/query`

**Input:** `{ query: string, scope: { location_id?: uuid, user_id: uuid } }`

**Architecture:**

1. **Cache lookup first.** Hash the normalized query string. If it matches a pre-cached demo query, return the cached response immediately. This is the single most important reliability decision in the build.

2. **If cache miss, call frontier model with tool/function definitions.** Tools:
   - `query_athletes(filters: { sport?, position?, age_min?, age_max?, location_id?, measurable_threshold?, status?, recruit_status? }) → athlete[]`
   - `get_athlete_measurables(athlete_id, metric?, since?) → measurable[]`
   - `get_athlete_attendance(athlete_id, since?) → attendance[]`
   - `get_at_risk_athletes(location_id?) → athlete[]` — athletes with 2+ consecutive missed sessions
   - `compare_locations(metric: 'revenue' | 'retention' | 'utilization', period) → comparison`
   - `get_coach_performance(coach_id?) → coach_stats[]`
   - `get_failed_payments(since?) → payment[]`
   - `summarize_athlete_progression(athlete_id, since?) → narrative_text`

3. **Model returns either a chart spec, a list, or a narrative.** Frontend renders accordingly:
   - `{ type: 'chart', chartType: 'line' | 'bar', data, x, y, title }`
   - `{ type: 'list', items, columns }`
   - `{ type: 'narrative', markdown }`
   - `{ type: 'mixed', blocks: [...] }`

4. **Streaming.** Use the model's streaming API for narrative responses so text appears progressively. Charts/lists render after structured output completes.

### Pre-cache these exact queries (demo path)

The team must hardcode response objects for these queries, keyed by normalized hash:

- "which athletes are at risk of churning this week" / variations
- "show me revenue by location this quarter" / variations
- "compare phoenix and mesa member retention" / variations
- "compare marcus's vertical progression to other 2027 recruits in our system" / variations
- "show me every quarterback with a 40 under 4.7" / variations
- "how is marcus johnson trending" / variations
- "which coaches have the highest member retention" / variations

Normalization: lowercase, strip punctuation, collapse whitespace, stem common variants ("show me" / "show" / "list").

### At-risk re-engagement message generation

**Endpoint:** `POST /api/ai/draft-message`

**Input:** `{ athlete_id, coach_id, context: 'reengagement' | 'congratulations' | 'pr_alert' }`

**Architecture:**

1. Fetch athlete profile, recent measurables (especially recent PRs), recent attendance pattern, last few coach notes, parent contact preference.
2. Fetch coach voice sample.
3. Prompt frontier model: generate SMS-length message (160 chars target, 320 absolute max) from coach to parent or athlete, referencing specific shared history, in the coach's voice.
4. Return draft. Frontend displays editable, with "Send" CTA. "Send" creates a `messages` row, optionally triggers a real SMS (but for demo: log to DB and show "Sent ✓").

For Tyler Chen specifically (demo path): pre-write the ideal message and return it when his ID is the input. Don't risk live generation on the headline demo moment.

### Athlete AI summary (profile right rail)

Pre-generate for all athletes at seed time. Store in `athletes.ai_summary`. Do not generate on read — too slow, too unpredictable for demo.

For hero athletes, hand-write or hand-edit these to be exceptional. They are the screens that get lingered on.

### Semantic search on coach notes

When the natural-language query references qualitative coach observations ("athletes coaches have flagged for mobility issues"), use pgvector cosine similarity on `coach_notes.embedding` against the embedded query string.

Generate embeddings at seed time using any standard embedding model. Do not generate at query time.

---

## 4. Frontend specification

### Design system

Build one shared component library and design token set. Three brand expressions share the same tokens:

**Tokens:**
- Spacing scale: 4px base, 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96
- Radius: sm 4px, md 8px, lg 12px, xl 16px, full 9999px
- Type scale: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64 / 80
- Font: one sans-serif display + one sans-serif body. Suggested: Inter or Geist for body, a tighter display face for hero (Söhne, NB International, or similar — free alternatives like Geist Mono work)
- Motion: 150ms / 250ms / 400ms easing curves, prefer ease-out for entrances

**Legacy public site palette:**
- Background: near-black `#0A0B0D`
- Surface: `#15171B`
- Surface elevated: `#1E2127`
- Border: `#2A2D34`
- Text primary: `#F5F6F7`
- Text secondary: `#9DA3AE`
- Accent: deep orange `#FF5A1F` (athletic energy, distinct from gym-industry red)
- Success: `#10B981`

**Legacy Command (OS) palette:**
- Same dark base as public site for brand consistency
- Slightly cooler surface tones to read as "software" vs. "marketing"
- Accent: `#3B82F6` (data/intelligence cue) used alongside the orange for system actions

**Scout Portal palette:**
- Lighter, more institutional — off-white `#FAFAFA` background, deep navy `#1A2332` accents
- Visually distinct from OS so demo viewers immediately register "different product"

**Wordmark:** "LEGACY" in a wide-tracked uppercase display face for the public site; "LEGACY COMMAND" with a small mark (geometric, suggesting a control surface or radar) for the OS. Generate as SVG.

### Component inventory (shared)

- `Button` — primary, secondary, ghost, destructive; sizes sm/md/lg
- `Input`, `Textarea`, `Select`, `Combobox`, `DateRangePicker`
- `Card`, `Stat`, `MetricCard`
- `Table` with sort, filter, row hover, sticky header
- `Tabs`, `Accordion`, `Dialog`, `Sheet`, `Tooltip`, `Popover`
- `Avatar`, `Badge`, `Pill`, `Tag`
- `Chart wrappers` — `LineChart`, `BarChart`, `AreaChart`, `Heatmap`, `Sparkline`
- `LocationSwitcher` — top-nav dropdown showing all 5 locations + "All locations"
- `NaturalLanguageInput` — large prominent input with autocomplete suggestions, streaming response area below
- `InsightCard` — title, body, optional chart preview, click target
- `MessageThread` — chat-bubble view for Comms Hub
- `AthleteCard` — used in scout results and lead lists
- `Skeleton` loaders for every async surface

### Page-by-page spec

#### Public site `(marketing)`

**`/` Home**
- Hero: full-viewport-height, looping background video of training b-roll (use stock from Pexels/Mixkit), dark overlay, centered headline ("Where athletes become recruits."), subhead, primary CTA "Book a free assessment", secondary "Explore programs"
- Strip below hero: 4 animated stat counters — athletes trained, college commitments, locations, years
- Programs section: 5 cards in a horizontal scroll on mobile, grid on desktop
- Testimonial reel: 3 athlete quotes with photos, auto-rotating
- Locations: 5 location cards with photos, address, "Book a tour" CTA
- Footer

**`/programs`**
- Hero (shorter)
- 5 program detail cards, expandable to full detail view
- CTA strip

**`/locations`** and **`/locations/[slug]`**
- Index: map + 5 cards
- Detail: hero photo, facility specs, hours, coaches at this location, "Book a tour" form, embedded map

**`/athletes`** (success stories)
- Grid of 6–10 athlete success cards
- Click → public athlete profile (subset of OS profile data — measurables, success story, photo, video clip)

**`/about`**
- Team, philosophy, story

**Lead capture form** (used on multiple pages):
- Parent name, email, phone, athlete name, athlete age, interested program, interested location, optional notes
- On submit: POST to `/api/leads`, insert into `leads` table, fire realtime channel `leads:new`, return success
- Show inline success state with "We'll be in touch within 24 hours"

#### Legacy Command `(app)`

**Top nav (persistent):**
- Logo (left)
- Location switcher (center-left)
- Natural-language input (center, prominent — always visible)
- Notifications bell
- User avatar (right)

**Left sidebar nav:**
- Command Center (home)
- Athletes
- Leads
- Schedule
- Communications
- Operations
- Scouts (data licensing)
- Settings

**`/` Command Center**
- Greeting: "Good morning, Amber"
- 6 insight cards in a responsive grid:
  1. At-risk members count + sparkline → click to retention view
  2. Hero athlete spotlight ("Marcus Johnson up 8% vertical")
  3. Location utilization anomaly
  4. Cohort enrollment trend
  5. Failed payments alert
  6. Coach satisfaction score
- Below: "Recent activity" stream — new leads, completed sessions, payments, messages
- Right rail: "Today's schedule" snapshot across all locations
- Natural-language input is the focal point — large, top-center, persistent

**`/athletes`**
- Filter bar: location, sport, position, status, recruit status, search
- Table view with photo, name, age, sport, program, location, status, last attended
- Click row → athlete profile

**`/athletes/[id]`** (the hero screen)
- Header: photo, name, age, sport+position, program, status badge, parent contact, billing status, "Message" / "Edit" actions
- Tabs:
  1. **Overview** — AI summary (right rail), recent measurables snapshot, upcoming sessions, recent activity
  2. **Measurables** — time-series charts per metric, PR flags, comparison to cohort
  3. **Wearables** — sleep, HRV, strain, recovery cards; 30-day trend chart; alerts panel
  4. **Attendance** — calendar heatmap, streak counter, no-show flags
  5. **Notes** — chronological coach notes, add-note input, AI summary toggle
  6. **Video** — clip grid with AI tags
  7. **Communications** — full thread history with athlete and parents
- Right rail (sticky): AI narrative summary, "Suggested actions" (e.g. "Recommend introducing to Coach Chen — Sun Devil State")

**`/retention`** (at-risk dashboard)
- Top: at-risk count, churn rate trend, retention rate
- Main: table of at-risk athletes sorted by risk score
- Click athlete → side sheet with attendance pattern, last message, "Draft re-engagement message" CTA
- Click "Draft re-engagement" → opens modal with AI-generated message, editable, "Send" CTA

**`/leads`**
- Kanban: new, contacted, scheduled, converted, lost
- Realtime updates — when website lead arrives, card animates in with a subtle highlight
- Click lead → side sheet with lead detail, message thread, "Assign coach" / "Convert to athlete" actions

**`/communications`**
- Two-pane: thread list (left), thread detail (right)
- Filters: channel, unread, athlete vs lead, location
- Reply input with template picker and AI suggest

**`/schedule`**
- Week view grid: locations × time, color-coded by program
- Click session → roster, check-ins, coach
- Drag-and-drop interactions are out of scope; click-to-view only

**`/operations`**
- Tabs: Locations, Coaches, Programs, Facilities
- Mostly static views — utilization heatmaps, coach roster, program catalog

**`/scouts`**
- Internal view: "Active scouts viewing your data" — list of scout_users
- Data licensing metrics: scout seats, monthly revenue, top-searched athletes
- Configure athlete visibility (scout_visible toggle in athlete records)

**`/cost-comparison`** (the close)
- Two-column side-by-side
- Left: current stack with line items and monthly costs (from transcript)
- Right: Legacy Command unified line + projected Scout Portal revenue
- Bottom: rolling 24-month projection chart

#### Scout Portal `(scout)`

Branded differently from OS. Lighter UI. Distinct typography.

**`/scout/login`**
- Split-screen: branding left, login form right
- Demo credentials hint: Coach Mike Chen

**`/scout`** dashboard
- Saved searches
- Recently viewed athletes
- "Recommended for you" based on scout's interested_positions

**`/scout/search`**
- Filters in left panel: position (multi), age range, location + radius, measurable thresholds (40 ≤ X seconds, vertical ≥ Y inches, bench ≥ Z lbs), GPA min, graduation year, recruit status
- Right: results grid of athlete cards, sortable
- Each card: photo, name, age, school, key measurables, "View profile" CTA

**`/scout/athletes/[id]`**
- Subset of internal profile: photo, bio, measurables, video clips, school info, recruit status, contact (gated — "Request introduction" button rather than direct contact)
- "Save to my list" CTA
- Watermark: "Data licensed from Legacy Sports Complex"

**`/scout/billing`**
- Subscription tier card — "$X / seat / year, X seats active"

---

## 5. Realtime + the lead handoff demo moment

This is the single highest-impact interaction in the demo. Get it right.

**Flow:**
1. Demo presenter navigates to public site `/locations/mesa` in tab A.
2. Fills lead form (Sarah Williams, parent of Jake, age 14, combine prep, Mesa).
3. Hits submit. Form POSTs to `/api/leads`.
4. Server inserts row into `leads`, then publishes to realtime channel `leads:new`.
5. Presenter switches to tab B (already open on OS Command Center or Leads page).
6. Within 1–2 seconds, the new lead appears with a subtle slide-in animation and a soft notification chime.

**Implementation:**
- Use database provider's realtime subscriptions, subscribed in a global `LeadsRealtimeProvider` at the OS app root.
- On message receipt: toast notification ("New lead: Sarah Williams") + invalidate leads list query + animate new card.
- Fallback: if realtime fails, the Leads page polls `/api/leads?since=last_fetch` every 2 seconds during the demo (toggleable via a feature flag).

**Demo safety:**
- Test this end-to-end at least 10 times before Tuesday.
- Have a backup pre-recorded screen video of this exact flow that can be played if live fails.

---

## 6. Seed data specification

### Hero athletes (5)

These get hand-crafted detail. All seed data scripts should special-case these IDs.

**1. Marcus Johnson — the breakout recruit**
- 16, junior, football, quarterback
- Phoenix location, Combine Prep program
- 6'2", 195 lbs, GPA 3.6
- Measurables trajectory: 40-yard 4.78 → 4.62 over 9 months; vertical 31" → 36" over 6 months
- 4 video clips, 22 coach notes, full wearable history
- Recruit status: considering, 3 D1 inquiries
- AI summary references his vertical jump trajectory and projects him as a high-likelihood D1 commit
- This is the athlete the demo opens to. Make him exceptional.

**2. Tyler Chen — the at-risk athlete**
- 15, sophomore, basketball, point guard
- Mesa location, Youth Performance program
- Recent PR: squat 225 → 245 lbs three weeks ago
- Attendance pattern: consistent 3x/week for 8 months, then missed Tuesday and Thursday of current week (6 days no contact)
- Coach: Mike Rodriguez (Mesa)
- Pre-written re-engagement message ready in cache, references his recent squat PR
- AI risk score: 87%

**3. Sofia Martinez — the multi-sport phenom**
- 14, freshman, soccer + track
- Gilbert location, Youth Performance
- Multiple PRs in 100m and vertical
- Strong academic — GPA 4.0
- Story arc: started 12 months ago as a generalist, now data shows clear soccer specialization signal
- Used in cohort comparison queries

**4. DeShawn Williams — the late bloomer**
- 17, senior, football, wide receiver
- Scottsdale location, College Recruit Track
- Modest measurables 12 months ago, dramatic improvement curve
- Story: was overlooked, now has 2 D1 offers
- Used in "transformation" success story on public site

**5. Emma Patel — the parent-engaged athlete**
- 13, 8th grade, volleyball
- Chandler location, Youth Performance
- Strong parent communication thread (mother is engaged, texts frequently)
- Used in Comms Hub demo to show parent thread depth

### Background athletes (145)

Generated with realistic distributions:
- Age: weighted toward 13–17 (peak training years)
- Sport: football 35%, basketball 25%, baseball 15%, soccer 10%, multi-sport 10%, other 5%
- Status: active 75%, paused 10%, at_risk 8%, churned 7%
- Recruit status: uncommitted 60%, considering 25%, committed 10%, signed 5% (among 16–18 year olds; younger athletes all uncommitted)
- Location distribution: roughly even across 5 locations
- GPA: normal distribution mean 3.3, sd 0.4
- Measurables: realistic position-specific distributions with believable noise and slight upward trends over time (training works)
- Photo: use generated portrait service for consistency; avoid AI-art faces that look uncanny

### Generation script

Single TypeScript or Python script that idempotently seeds the database. Re-runnable. Stores hero athlete IDs in environment variables so the rest of the app references them stably.

Use a seedable PRNG so the data is identical across re-seeds — important for the demo path being stable.

---

## 7. Build sequence

### Saturday (Day 0): Foundation

**Engineer 1 — App scaffold**
- Repo, framework, Tailwind, component library, design tokens
- Auth setup with role-based access (legacy_staff, scout)
- DB schema migrations
- Realtime channel setup
- Deploy pipeline to staging domain

**Engineer 2 — Seed data**
- Write seed script
- Generate 150 athletes including 5 hero athletes
- Generate 12 months of measurables, attendance, sessions
- Generate 200 leads, 90 days of messages
- Generate wearable data for hero athletes
- Source/generate portrait images
- Source 3–4 stock training video clips

**Engineer 3 (or Param) — AI infrastructure**
- `/api/ai/query` endpoint with tool/function definitions
- Pre-cache layer for scripted queries
- `/api/ai/draft-message` endpoint
- Pre-generate athlete AI summaries
- Generate coach voice samples, embeddings for coach notes

**End of Day 0 deliverable:** Deployable app shell at staging URL with seeded DB, working auth, working AI endpoints (cached responses ready).

### Sunday (Day 1): Hero OS surfaces

**Engineer 1 — Athlete profile**
- All 6 tabs, polished
- Charts rendering real measurable data
- Wearables view with mocked stream
- Notes view with AI summary toggle

**Engineer 2 — Command Center + Retention**
- Command Center page with 6 insight cards
- Natural-language input wired to `/api/ai/query`
- Streaming response rendering
- Chart/list/narrative result types
- Retention page with at-risk table
- Draft-message modal flow

**Engineer 3 — Multi-location + Leads + Comms Hub**
- Location switcher in top nav
- Scope-aware data fetching across all OS pages
- Leads kanban with realtime subscription
- Comms Hub thread list + detail

**End of Day 1 deliverable:** All 5 demo-critical OS interactions working end-to-end. Demo path executable.

### Monday (Day 2): Public site + Scout Portal + polish

**Engineer 1 — Public website**
- All 5 pages, polished, motion
- Lead capture form wired to `/api/leads`
- Realtime handoff to OS tested end-to-end

**Engineer 2 — Scout Portal**
- Separate brand expression
- Login flow
- Search interface with filters
- Athlete cards + public profile view
- Billing/seats page (mostly static)

**Engineer 3 — Cost comparison + polish**
- Cost comparison screen
- Operations and Schedule pages (light interaction, full visual polish)
- Loading skeletons everywhere
- Empty states
- Animation polish on key transitions

**End of Day 2 deliverable:** Full demo path executable, all surfaces visually complete.

### Monday evening: Rehearsal

- Full demo dry-run 1: identify rough edges
- Fix list
- Full demo dry-run 2: confirm fixes
- Record backup video of full walkthrough
- Verify all pre-cached AI queries return correctly
- Verify realtime lead handoff works 10/10 times

### Tuesday morning: Final pass

- One more full dry-run 2 hours before meeting
- Backup video ready, accessible offline
- Demo browser profile pre-loaded with all tabs in correct state

---

## 8. Risk register

| Risk | Mitigation |
|------|-----------|
| AI query latency too slow | Pre-cache all scripted queries; hard cap response time at 3s; fallback to cached generic response |
| Realtime lead handoff fails live | Polling fallback; pre-recorded backup video |
| Seed data feels fake | Spend full day Saturday on this; use generated portraits; realistic distributions; hand-write hero athletes |
| Off-script question to NL input | Claude with function calling handles most; team should test 30+ off-script queries Monday |
| Scout Portal looks too similar to OS | Different palette, different type face, different layout grid; reviewer test on Monday |
| Demo browser/network issue | Local-first capable build; deploy to fast edge; presenter on wired connection if possible |
| Engineering scope overrun by Sunday night | Comms Hub, Operations, Schedule can degrade to static screenshots; hero surfaces are non-negotiable |

---

## 9. Out of scope (explicit)

- Production-grade multi-tenancy
- Real payment processing
- Real wearable device APIs
- Mobile native apps
- Real SMS/email sending (log to DB and show "sent" state)
- Accessibility audit
- Internationalization
- Granular permissions beyond legacy_staff / scout
- Real video processing or computer vision
- Production observability stack

---

## 10. Handoff to engineering

This spec is the source of truth. If using an agentic coding tool, feed sections individually with the build sequence as the orchestration prompt. Recommended:

- Section 2 → schema generation
- Section 3 → AI endpoint scaffolding
- Section 4 → page-by-page UI generation (one page per agent run)
- Section 6 → seed script generation

Reviewers should verify each output against the spec before merging, not after.

Param will run the final dry-run and own the demo path. Anything not on the demo path is decoration.
