-- Legacy Sports Complex Demo Schema
create extension if not exists "uuid-ossp";
create extension if not exists vector;

create table locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  lat numeric,
  lng numeric,
  square_footage integer,
  amenities text[],
  photo_urls text[],
  phone text,
  hours jsonb
);

create table programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  monthly_price numeric,
  target_age_min integer,
  target_age_max integer
);

create table coaches (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  photo_url text,
  bio text,
  specialties text[],
  primary_location_id uuid references locations(id),
  voice_sample text
);

create table athletes (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  date_of_birth date,
  sport text,
  position text,
  gender text,
  graduation_year integer,
  school text,
  gpa numeric,
  home_location_id uuid references locations(id),
  photo_url text,
  parent_name text,
  parent_email text,
  parent_phone text,
  program_id uuid references programs(id),
  enrollment_date date,
  status text,
  ai_summary text,
  scout_visible boolean default false,
  recruit_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table measurables (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  recorded_at timestamptz,
  metric text,
  value numeric,
  unit text,
  is_pr boolean default false,
  recorded_by_coach_id uuid references coaches(id)
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references locations(id),
  coach_id uuid references coaches(id),
  program_id uuid references programs(id),
  starts_at timestamptz,
  ends_at timestamptz,
  room text,
  capacity integer
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  session_id uuid references sessions(id),
  checked_in_at timestamptz,
  status text
);

create table coach_notes (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  coach_id uuid references coaches(id),
  created_at timestamptz default now(),
  content text,
  tags text[],
  embedding vector(1536)
);

create table wearable_data (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  recorded_at timestamptz,
  source text,
  metric text,
  value numeric
);

create table video_clips (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  title text,
  thumbnail_url text,
  video_url text,
  ai_tags text[],
  recorded_at timestamptz
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  source text,
  first_name text,
  last_name text,
  email text,
  phone text,
  athlete_name text,
  athlete_age integer,
  interested_program_id uuid references programs(id),
  interested_location_id uuid references locations(id),
  notes text,
  status text default 'new',
  assigned_coach_id uuid references coaches(id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  channel text,
  direction text,
  from_party text,
  to_party text,
  athlete_id uuid references athletes(id),
  lead_id uuid references leads(id),
  subject text,
  body text,
  read_at timestamptz,
  ai_generated boolean default false
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  amount numeric,
  status text,
  processed_at timestamptz,
  description text
);

create table scout_users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  organization text,
  role text,
  interested_positions text[],
  geographic_focus text,
  auth_user_id uuid references auth.users(id)
);

create table saved_searches (
  id uuid primary key default gen_random_uuid(),
  scout_user_id uuid references scout_users(id) on delete cascade,
  name text,
  filters jsonb
);

create index idx_athletes_location on athletes(home_location_id, status, sport, scout_visible);
create index idx_measurables_athlete on measurables(athlete_id, metric, recorded_at);
create index idx_leads_created on leads(created_at desc);
