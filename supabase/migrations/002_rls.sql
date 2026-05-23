alter table locations enable row level security;
alter table programs enable row level security;
alter table coaches enable row level security;
alter table athletes enable row level security;
alter table measurables enable row level security;
alter table sessions enable row level security;
alter table attendance enable row level security;
alter table coach_notes enable row level security;
alter table wearable_data enable row level security;
alter table video_clips enable row level security;
alter table leads enable row level security;
alter table messages enable row level security;
alter table payments enable row level security;
alter table scout_users enable row level security;
alter table saved_searches enable row level security;

create or replace function public.user_role()
returns text language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'anon');
$$;

-- Staff: full access
create policy staff_all_locations on locations for all using (public.user_role() = 'legacy_staff');
create policy staff_all_programs on programs for all using (public.user_role() = 'legacy_staff');
create policy staff_all_coaches on coaches for all using (public.user_role() = 'legacy_staff');
create policy staff_all_athletes on athletes for all using (public.user_role() = 'legacy_staff');
create policy staff_all_measurables on measurables for all using (public.user_role() = 'legacy_staff');
create policy staff_all_sessions on sessions for all using (public.user_role() = 'legacy_staff');
create policy staff_all_attendance on attendance for all using (public.user_role() = 'legacy_staff');
create policy staff_all_notes on coach_notes for all using (public.user_role() = 'legacy_staff');
create policy staff_all_wearables on wearable_data for all using (public.user_role() = 'legacy_staff');
create policy staff_all_videos on video_clips for all using (public.user_role() = 'legacy_staff');
create policy staff_all_leads on leads for all using (public.user_role() = 'legacy_staff');
create policy staff_all_messages on messages for all using (public.user_role() = 'legacy_staff');
create policy staff_all_payments on payments for all using (public.user_role() = 'legacy_staff');
create policy staff_read_scouts on scout_users for select using (public.user_role() = 'legacy_staff');
create policy staff_all_saved on saved_searches for all using (public.user_role() = 'legacy_staff');

-- Scout: read-only subset
create policy scout_read_athletes on athletes for select using (
  public.user_role() = 'scout' and scout_visible = true
);
create policy scout_read_measurables on measurables for select using (
  public.user_role() = 'scout' and exists (
    select 1 from athletes a where a.id = athlete_id and a.scout_visible = true
  )
);
create policy scout_read_videos on video_clips for select using (
  public.user_role() = 'scout' and exists (
    select 1 from athletes a where a.id = athlete_id and a.scout_visible = true
  )
);
create policy scout_read_locations on locations for select using (public.user_role() = 'scout');
create policy scout_read_programs on programs for select using (public.user_role() = 'scout');
create policy scout_own_profile on scout_users for select using (
  public.user_role() = 'scout' and auth_user_id = auth.uid()
);
create policy scout_own_searches on saved_searches for all using (
  public.user_role() = 'scout' and scout_user_id in (
    select id from scout_users where auth_user_id = auth.uid()
  )
);
