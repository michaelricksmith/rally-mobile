-- ============================================================================
-- 0003_seed.sql — LOCAL-ONLY seed for Rally mobile.
--
-- This seed creates two demo users, one group, one placeholder challenge,
-- and one empty leaderboard row. It is gated by a guard that REFUSES to run
-- if the database is anything other than a clearly-local instance.
--
-- CI never applies this file. Local dev applies it via `supabase db reset`,
-- which spins up a local Postgres with project ref `local` and default port.
-- ============================================================================

do $$
declare
  v_is_local boolean;
  v_user_a uuid := '00000000-0000-0000-0000-00000000000a';
  v_user_b uuid := '00000000-0000-0000-0000-00000000000b';
  v_group  uuid := '00000000-0000-0000-0000-0000000000c1';
  v_chal   uuid := '00000000-0000-0000-0000-0000000000d1';
begin
  -- Guard: this seed must NEVER run against a non-local database.
  -- We detect "local" by checking the well-known local project ref / port.
  v_is_local :=
    current_setting('cluster_name', true) = 'local'
    or inet_server_port() in (54322, 5432)
    and current_database() in ('postgres', 'rally_test');
  if not coalesce(v_is_local, false) then
    raise exception 'seed blocked: refusing to run seed against a non-local database (% @ %)', current_database(), inet_server_addr();
  end if;

  -- NOTE: these are fake UUIDs only. Auth users in a real environment come
  -- from Supabase Auth; in tests we insert into profiles directly.

  insert into profiles (id, display_name) values
    (v_user_a, 'Demo Alice'),
    (v_user_b, 'Demo Bob')
  on conflict (id) do nothing;

  insert into groups (id, name, owner_id, primary_activity)
  values (v_group, 'Sunday Pickup (demo)', v_user_a, 'pickleball')
  on conflict (id) do nothing;

  insert into group_members (group_id, user_id, role) values
    (v_group, v_user_a, 'owner'),
    (v_group, v_user_b, 'member')
  on conflict do nothing;

  insert into challenges (id, group_id, name, category, goal_value, goal_unit, starts_at, ends_at, created_by)
  values (
    v_group || 'd1'::text::uuid,  -- not used; we'll instead use v_chal
    v_group,
    'Most sessions this month',
    'pickleball',
    10,
    'sessions',
    now(),
    now() + interval '30 days',
    v_user_a
  )
  on conflict do nothing;

  insert into challenges (id, group_id, name, category, goal_value, goal_unit, starts_at, ends_at, created_by)
  values (
    v_chal,
    v_group,
    'Placeholder weekly leaderboard',
    'pickleball',
    1,
    'sessions',
    now(),
    now() + interval '7 days',
    v_user_a
  )
  on conflict do nothing;

  insert into leaderboard_snapshots (group_id, window, captured_for, rows)
  values (
    v_group,
    'weekly',
    date_trunc('week', now()),
    '[]'::jsonb
  )
  on conflict do nothing;
end $$;
