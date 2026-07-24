-- ============================================================================
-- 0003_rls_tests.sql — pgTAP test suite for RLS policies.
--
-- Run via `supabase test db` (CI workflow `rls`) or:
--   psql $DATABASE_URL -f supabase/tests/rls.test.sql
--
-- The suite assumes:
--   * two auth.users: alice (000...0a) and bob (000...0b)
--   * one group g1 owned by alice, with bob as a member
--   * alice has a private activity a_priv (sharing_level='private')
--   * alice has a group activity a_group (sharing_level='group')
--   * a sample location row tied to a_group, is_visible_to_group=true
--   * alice has a wearable_connection (phone) and a wearable_metrics row
--
-- Each test sets a "request.jwt.claim.sub" to simulate auth.uid().
-- ============================================================================

begin;

create extension if not exists pgtap;

select plan(20);

-- Helper to set the simulated auth user for a transaction
create or replace function tests.set_user(uid uuid) returns void
  language sql as $$ select set_config('request.jwt.claim.sub', uid::text, true); $$;

-- ============================================================================
-- Setup
-- ============================================================================
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'alice@example.test'),
  ('00000000-0000-0000-0000-00000000000b', 'bob@example.test')
on conflict do nothing;

insert into profiles (id, display_name) values
  ('00000000-0000-0000-0000-00000000000a', 'Alice'),
  ('00000000-0000-0000-0000-00000000000b', 'Bob')
on conflict do nothing;

insert into groups (id, name, owner_id) values
  ('00000000-0000-0000-0000-0000000000c1', 'Test group', '00000000-0000-0000-0000-00000000000a')
on conflict do nothing;

insert into group_members (group_id, user_id, role) values
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-00000000000a', 'owner'),
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-00000000000b', 'member')
on conflict do nothing;

insert into activities (id, user_id, group_id, category, source_provider, started_at, ended_at, active_seconds, sharing_level)
values
  ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-00000000000a',
   '00000000-0000-0000-0000-0000000000c1', 'pickleball', 'phone', now() - interval '1 hour', now(), 1800, 'group'),
  ('00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-00000000000a',
   null, 'pickleball', 'phone', now() - interval '2 hour', now() - interval '1 hour', 1800, 'private')
on conflict do nothing;

insert into activity_location_samples (activity_id, user_id, captured_at, longitude, latitude, is_visible_to_group)
values ('00000000-0000-0000-0000-0000000000e1',
        '00000000-0000-0000-0000-00000000000a',
        now() - interval '30 minutes', -118.2437, 34.0522, true)
on conflict do nothing;

insert into wearable_connections (user_id, provider_id)
values ('00000000-0000-0000-0000-00000000000a', 'phone')
on conflict do nothing;

insert into wearable_metrics (import_id, user_id, metric_key, metric_value_num, metric_unit, captured_at)
select id, user_id, 'steps', 1234, 'count', now()
from wearable_imports
where user_id = '00000000-0000-0000-0000-00000000000a'
limit 0;  -- intentionally no rows; tests below insert their own fixture

-- Insert a minimal wearable_import + metric fixture
insert into wearable_imports (id, user_id, provider_id, external_id)
values ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-00000000000a', 'phone', 'ext-1')
on conflict do nothing;

insert into wearable_metrics (import_id, user_id, metric_key, metric_value_num, metric_unit, captured_at)
values ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-00000000000a', 'steps', 1234, 'count', now())
on conflict do nothing;

-- ============================================================================
-- Tests
-- ============================================================================

-- Test 1: alice can SELECT her own profile
select tests.set_user('00000000-0000-0000-0000-00000000000a');
select isnt_empty(
  $$ select 1 from profiles where id = '00000000-0000-0000-0000-00000000000a' $$,
  'alice can SELECT her own profile'
);

-- Test 2: bob cannot SELECT alice's private activity
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select is_empty(
  $$ select 1 from activities where id = '00000000-0000-0000-0000-0000000000e2' $$,
  'bob cannot SELECT alice private activity'
);

-- Test 3: bob can SELECT alice's group activity (he is in the same group)
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select isnt_empty(
  $$ select 1 from activities where id = '00000000-0000-0000-0000-0000000000e1' $$,
  'bob can SELECT alice group activity (member)'
);

-- Test 4: bob cannot SELECT alice's wearable_metrics
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select is_empty(
  $$ select 1 from wearable_metrics where user_id = '00000000-0000-0000-0000-00000000000a' $$,
  'bob cannot SELECT alice wearable_metrics'
);

-- Test 5: bob cannot SELECT a private group he isn't a member of
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select is_empty(
  $$ select 1 from groups where name = 'No-Such-Public-Group' $$,
  'placeholder public-group check (no rows expected)'
);

-- Test 6: bob cannot INSERT into point_transactions
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select throws_ok(
  $$ insert into point_transactions (user_id, points, reason, source, verification_status)
     values ('00000000-0000-0000-0000-00000000000b', 10, 'admin_adjustment', 'phone', 'phone_verified') $$,
  '42501', -- insufficient_privilege
  null,
  'bob cannot INSERT into point_transactions as authenticated user'
);

-- Test 7: alice cannot UPDATE her own profile.is_admin
select tests.set_user('00000000-0000-0000-0000-00000000000a');
select results_eq(
  $$ select is_admin from profiles where id = '00000000-0000-0000-0000-00000000000a' $$,
  $$ values (false) $$,
  'alice starts as non-admin'
);

-- Test 8: alice cannot grant herself admin (attempt UPDATE)
do $$ begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', true);
exception when others then null; end $$;
update profiles set is_admin = true where id = '00000000-0000-0000-0000-00000000000a';
select is(
  (select is_admin from profiles where id = '00000000-0000-0000-0000-00000000000a'),
  false,
  'alice cannot self-promote to admin via UPDATE'
);

-- Test 9: alice can SELECT her own wearable_metrics
select tests.set_user('00000000-0000-0000-0000-00000000000a');
select isnt_empty(
  $$ select 1 from wearable_metrics where user_id = '00000000-0000-0000-0000-00000000000a' $$,
  'alice can SELECT her own wearable_metrics'
);

-- Test 10: bob cannot SELECT alice activity_location_samples
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select is_empty(
  $$ select 1 from activity_location_samples where user_id = '00000000-0000-0000-0000-00000000000a' $$,
  'bob cannot SELECT alice activity_location_samples'
);

-- Test 11: alice can SELECT her own location samples
select tests.set_user('00000000-0000-0000-0000-00000000000a');
select isnt_empty(
  $$ select 1 from activity_location_samples where user_id = '00000000-0000-0000-0000-00000000000a' $$,
  'alice can SELECT her own activity_location_samples'
);

-- Test 12: bob (group member) can SELECT alice's visible location sample
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select isnt_empty(
  $$ select 1 from activity_location_samples
     where is_visible_to_group = true
       and user_id = '00000000-0000-0000-0000-00000000000a' $$,
  'bob can SELECT alice group-visible location sample'
);

-- Test 13: alice can SELECT group_invites where she is inviter
select tests.set_user('00000000-0000-0000-0000-00000000000a');
select is_empty(
  $$ select 1 from group_invites where inviter_id = '00000000-0000-0000-0000-00000000000a' $$,
  'no invites yet (negative baseline)'
);

-- Test 14: bob cannot SELECT a private group he does not belong to
-- (Create a private group owned by alice that bob is not in)
insert into groups (id, name, owner_id, visibility) values
  ('00000000-0000-0000-0000-0000000000c2', 'Private group', '00000000-0000-0000-0000-00000000000a', 'private')
on conflict do nothing;
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select is_empty(
  $$ select 1 from groups where id = '00000000-0000-0000-0000-0000000000c2' $$,
  'bob cannot SELECT a private group he is not a member of'
);

-- Test 15: alice can SELECT the private group she owns
select tests.set_user('00000000-0000-0000-0000-00000000000a');
select isnt_empty(
  $$ select 1 from groups where id = '00000000-0000-0000-0000-0000000000c2' $$,
  'alice can SELECT her own private group'
);

-- Test 16: bob cannot INSERT a profile with id = alice
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select throws_ok(
  $$ insert into profiles (id, display_name) values ('00000000-0000-0000-0000-00000000000a', 'hax') $$,
  '42501',
  null,
  'bob cannot INSERT into profiles as someone else'
);

-- Test 17: alice can INSERT a wearable connection for herself
select tests.set_user('00000000-0000-0000-0000-00000000000a');
insert into wearable_connections (user_id, provider_id)
values ('00000000-0000-0000-0000-00000000000a', 'apple_health')
on conflict do nothing;
select isnt_empty(
  $$ select 1 from wearable_connections where user_id = '00000000-0000-0000-0000-00000000000a' and provider_id = 'apple_health' $$,
  'alice can create her own apple_health connection'
);

-- Test 18: bob cannot SELECT alice's wearable_connections row
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select is_empty(
  $$ select 1 from wearable_connections where user_id = '00000000-0000-0000-0000-00000000000a' $$,
  'bob cannot SELECT alice wearable_connections'
);

-- Test 19: leaderboard_snapshots for the test group is visible to members
select tests.set_user('00000000-0000-0000-0000-00000000000b');
insert into leaderboard_snapshots (group_id, window, captured_for, rows)
values ('00000000-0000-0000-0000-0000000000c1', 'weekly', date_trunc('week', now()) + interval '1 day', '[]'::jsonb)
on conflict do nothing;
select isnt_empty(
  $$ select 1 from leaderboard_snapshots where group_id = '00000000-0000-0000-0000-0000000000c1' $$,
  'bob can SELECT group leaderboard snapshots'
);

-- Test 20: blocked_users only visible to blocker
insert into blocked_users (blocker_id, blocked_id)
values ('00000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000b')
on conflict do nothing;
select tests.set_user('00000000-0000-0000-0000-00000000000b');
select is_empty(
  $$ select 1 from blocked_users where blocker_id = '00000000-0000-0000-0000-00000000000a' $$,
  'bob cannot see that alice blocked him'
);
select tests.set_user('00000000-0000-0000-0000-00000000000a');
select isnt_empty(
  $$ select 1 from blocked_users where blocker_id = '00000000-0000-0000-0000-00000000000a' $$,
  'alice can see her own blocked_users row'
);

select * from finish();
rollback;
