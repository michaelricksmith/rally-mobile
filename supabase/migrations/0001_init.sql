-- ============================================================================
-- 0001_init.sql — Rally mobile, Phase 0 schema
--
-- 31 tables covering identity, social, groups, activity, wearables, and
-- competition. All multi-tenant tables have RLS enabled. Sensitive health and
-- wearable tables are isolated and have stricter policies.
--
-- Conventions:
--   * primary key: `id uuid default gen_random_uuid()`
--   * timestamps: `created_at timestamptz default now()`
--   * soft-delete: `deleted_at timestamptz null`
--   * enums are explicit; do not use free-text for status / category fields
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_stat_statements";

-- ----------------------------------------------------------------------------
-- 1. Identity & social
-- ----------------------------------------------------------------------------

create type verification_status as enum (
  'rally_live_verified',
  'wearable_verified',
  'health_platform_imported',
  'phone_verified',
  'manually_entered',
  'flagged',
  'invalidated'
);

create type session_status as enum (
  'active',
  'paused',
  'processing',
  'imported',
  'completed',
  'cancelled',
  'flagged',
  'invalidated'
);

create type activity_category as enum (
  'pickleball',
  'running',
  'walking',
  'basketball',
  'hiking',
  'cycling',
  'tennis',
  'golf',
  'general_fitness',
  'other'
);

create type wearable_provider_id as enum (
  'phone',
  'apple_health',
  'apple_watch',
  'health_connect',
  'fitbit',
  'garmin',
  'samsung_health',
  'oura',
  'whoop',
  'manual'
);

create type group_role as enum ('owner', 'admin', 'member');

create type invite_status as enum ('pending', 'accepted', 'declined', 'revoked', 'expired');

create type sharing_level as enum (
  'group',
  'selected_friends',
  'no_location',
  'summary_only',
  'private'
);

create type point_reason as enum (
  'verified_active_minute',
  'session_completion',
  'group_participation',
  'challenge_completion',
  'personal_record',
  'streak_bonus',
  'wearable_verification_bonus',
  'admin_adjustment',
  'reversal'
);

create type leaderboard_window as enum ('daily', 'weekly', 'monthly', 'all_time', 'challenge');

create type challenge_format as enum ('individual', 'group');

create type campaign_visibility as enum ('public', 'group', 'invite_only');

create type import_status as enum (
  'pending',
  'imported',
  'duplicate_pending',
  'duplicate_resolved',
  'rejected',
  'failed'
);

-- profiles: 1:1 with auth.users, public-facing social surface
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  region text,
  preferred_units text not null default 'metric' check (preferred_units in ('metric', 'imperial')),
  privacy_default_sharing sharing_level not null default 'no_location',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_display_name_idx on profiles (display_name);

-- friendships: explicit symmetric-ish edges
create table friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id) on delete cascade,
  addressee_id uuid not null references profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'accepted', 'declined', 'blocked')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);
create index friendships_requester_idx on friendships (requester_id);
create index friendships_addressee_idx on friendships (addressee_id);

-- blocked_users: who has blocked whom
create table blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create index blocked_users_blocker_idx on blocked_users (blocker_id);

-- reports: moderation queue
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id) on delete set null,
  target_kind text not null check (target_kind in ('profile', 'group', 'activity', 'comment')),
  target_id uuid not null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  resolved_by uuid references profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index reports_target_idx on reports (target_kind, target_id);
create index reports_status_idx on reports (status);

-- reactions: emoji reactions on activities
create table reactions (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null,
  user_id uuid not null references profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (activity_id, user_id, emoji)
);
create index reactions_activity_idx on reactions (activity_id);

-- comments: text comments on activities
create table comments (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null check (length(body) between 1 and 1000),
  edited_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
create index comments_activity_idx on comments (activity_id);

-- notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on notifications (user_id, read_at);

-- audit_logs: server-side append-only
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  target_kind text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
create index audit_logs_actor_idx on audit_logs (actor_id);
create index audit_logs_target_idx on audit_logs (target_kind, target_id);

-- ----------------------------------------------------------------------------
-- 2. Groups
-- ----------------------------------------------------------------------------

create table groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 2 and 60),
  description text check (length(description) <= 500),
  primary_activity activity_category not null default 'pickleball',
  image_url text,
  owner_id uuid not null references profiles(id) on delete restrict,
  max_members int not null default 50 check (max_members between 2 and 500),
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index groups_owner_idx on groups (owner_id);
create index groups_primary_activity_idx on groups (primary_activity);

create table group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role group_role not null default 'member',
  joined_at timestamptz not null default now(),
  removed_at timestamptz,
  unique (group_id, user_id)
);
create index group_members_user_idx on group_members (user_id);

create table group_invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  inviter_id uuid not null references profiles(id) on delete cascade,
  invitee_id uuid references profiles(id) on delete cascade,
  invitee_email text,
  code text not null check (length(code) between 6 and 16),
  status invite_status not null default 'pending',
  expires_at timestamptz not null,
  accepted_at timestamptz,
  declined_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (group_id, code)
);
create index group_invites_invitee_idx on group_invites (invitee_id);
create index group_invites_code_idx on group_invites (code);

-- ----------------------------------------------------------------------------
-- 3. Activity
-- ----------------------------------------------------------------------------

create table activity_types (
  id uuid primary key default gen_random_uuid(),
  category activity_category not null unique,
  display_name text not null,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- activities: server-controlled truth for a single recorded or imported activity
create table activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  group_id uuid references groups(id) on delete set null,
  category activity_category not null,
  source_provider wearable_provider_id not null,
  external_activity_id text,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  active_seconds int not null check (active_seconds >= 0),
  distance_meters numeric(10, 2),
  steps int,
  active_energy_kcal numeric(10, 2),
  avg_heart_rate_bpm int,
  max_heart_rate_bpm int,
  speed_meters_per_second numeric(6, 3),
  elevation_gain_meters numeric(8, 2),
  route_available boolean not null default false,
  verification_status verification_status not null default 'manually_entered',
  sharing_level sharing_level not null default 'no_location',
  session_status session_status not null default 'completed',
  notes text check (length(notes) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (ended_at >= started_at)
);
create index activities_user_idx on activities (user_id, started_at desc);
create index activities_group_idx on activities (group_id, started_at desc);
create index activities_category_idx on activities (category);
create index activities_verification_idx on activities (verification_status);
create unique index activities_external_id_uniq
  on activities (user_id, source_provider, external_activity_id)
  where external_activity_id is not null;

-- activity_participants: multi-user sessions (e.g. doubles pickleball)
create table activity_participants (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activities(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'participant' check (role in ('host', 'participant')),
  joined_at timestamptz not null default now(),
  unique (activity_id, user_id)
);
create index activity_participants_user_idx on activity_participants (user_id);

-- activity_location_samples: high-restriction table. Default OFF.
create table activity_location_samples (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activities(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  captured_at timestamptz not null,
  longitude double precision not null check (longitude between -180 and 180),
  latitude double precision not null check (latitude between -90 and 90),
  altitude_meters double precision,
  horizontal_accuracy_meters double precision,
  speed_meters_per_second double precision,
  heading_degrees double precision,
  -- only authorized viewers can see this row
  is_visible_to_group boolean not null default false,
  created_at timestamptz not null default now()
);
create index activity_location_samples_activity_idx on activity_location_samples (activity_id, captured_at);
create index activity_location_samples_user_idx on activity_location_samples (user_id);

-- activity_source_records: provider-specific raw audit (one row per source)
create table activity_source_records (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activities(id) on delete cascade,
  source_provider wearable_provider_id not null,
  external_id text,
  raw_payload jsonb not null,
  import_status import_status not null default 'imported',
  imported_at timestamptz not null default now()
);
create index activity_source_records_activity_idx on activity_source_records (activity_id);

-- ----------------------------------------------------------------------------
-- 4. Wearables
-- ----------------------------------------------------------------------------

create table wearable_providers (
  id wearable_provider_id primary key,
  display_name text not null,
  oauth_required boolean not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table wearable_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider_id wearable_provider_id not null references wearable_providers(id) on delete restrict,
  -- encrypted at rest via pgsodium in production; column-level encrypt in a follow-up migration
  access_token_encrypted bytea,
  refresh_token_encrypted bytea,
  token_expires_at timestamptz,
  scopes text[] not null default '{}',
  is_connected boolean not null default true,
  last_sync_at timestamptz,
  connected_at timestamptz not null default now(),
  disconnected_at timestamptz,
  unique (user_id, provider_id)
);
create index wearable_connections_user_idx on wearable_connections (user_id);

create table wearable_imports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider_id wearable_provider_id not null references wearable_providers(id) on delete restrict,
  external_id text not null,
  matched_activity_id uuid references activities(id) on delete set null,
  import_status import_status not null default 'pending',
  imported_at timestamptz not null default now(),
  unique (user_id, provider_id, external_id)
);
create index wearable_imports_user_idx on wearable_imports (user_id);

create table wearable_metrics (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references wearable_imports(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  metric_key text not null,
  metric_value_num double precision,
  metric_value_text text,
  metric_unit text,
  captured_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (metric_value_num is not null or metric_value_text is not null)
);
create index wearable_metrics_import_idx on wearable_metrics (import_id);
create index wearable_metrics_user_idx on wearable_metrics (user_id);

create table sync_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider_id wearable_provider_id not null references wearable_providers(id) on delete restrict,
  kind text not null check (kind in ('pull', 'push', 'manual')),
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed')),
  started_at timestamptz,
  finished_at timestamptz,
  error_message text,
  records_processed int not null default 0,
  created_at timestamptz not null default now()
);
create index sync_jobs_user_idx on sync_jobs (user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- 5. Competition
-- ----------------------------------------------------------------------------

create table point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  group_id uuid references groups(id) on delete set null,
  activity_id uuid references activities(id) on delete set null,
  challenge_id uuid,
  points int not null,
  reason point_reason not null,
  source wearable_provider_id not null,
  verification_status verification_status not null,
  reversed_by uuid references point_transactions(id),
  reversal_of uuid references point_transactions(id),
  created_at timestamptz not null default now()
);
create index point_transactions_user_idx on point_transactions (user_id, created_at desc);
create index point_transactions_group_idx on point_transactions (group_id, created_at desc);

create table leaderboard_snapshots (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  window leaderboard_window not null,
  captured_for timestamptz not null,
  -- rank, user_id, display_name, points, sessions, active_minutes, streak, prev_rank, verification_indicator
  rows jsonb not null,
  created_at timestamptz not null default now(),
  unique (group_id, window, captured_for)
);
create index leaderboard_snapshots_group_idx on leaderboard_snapshots (group_id, window, captured_for desc);

create table challenges (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  name text not null check (length(name) between 2 and 80),
  description text,
  category activity_category not null,
  format challenge_format not null default 'group',
  goal_value int not null check (goal_value > 0),
  goal_unit text not null check (goal_unit in ('sessions', 'active_minutes', 'days', 'points', 'distance_meters')),
  required_verification verification_status not null default 'rally_live_verified',
  accepted_sources wearable_provider_id[] not null default array[]::wearable_provider_id[],
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_by uuid not null references profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index challenges_group_idx on challenges (group_id, starts_at desc);

create table challenge_participants (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);
create index challenge_participants_user_idx on challenge_participants (user_id);

create table challenge_progress (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  progress_value int not null default 0,
  is_completed boolean not null default false,
  completed_at timestamptz,
  last_updated_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);
create index challenge_progress_challenge_idx on challenge_progress (challenge_id, progress_value desc);

create table sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_email text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table prizes (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid references sponsors(id) on delete set null,
  name text not null,
  description text,
  approx_value_usd numeric(10, 2),
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid references sponsors(id) on delete set null,
  prize_id uuid references prizes(id) on delete set null,
  name text not null,
  description text,
  category activity_category not null,
  required_verification verification_status not null default 'wearable_verified',
  required_provider wearable_provider_id,
  visibility campaign_visibility not null default 'public',
  min_age int check (min_age is null or min_age >= 13),
  region text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  official_rules_url text,
  entry_limit_per_user int not null default 1,
  winner_selection_method text not null default 'random' check (winner_selection_method in ('random', 'top_points', 'first_to_complete', 'manual')),
  status text not null default 'draft' check (status in ('draft', 'active', 'ended', 'cancelled')),
  created_by uuid not null references profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index campaigns_status_idx on campaigns (status, starts_at);
create index campaigns_category_idx on campaigns (category);

create table campaign_entries (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  source_activity_id uuid references activities(id) on delete set null,
  source_provider wearable_provider_id not null,
  verification_status verification_status not null,
  referral_user_id uuid references profiles(id),
  is_winner boolean not null default false,
  fraud_review_status text not null default 'clear' check (fraud_review_status in ('clear', 'reviewing', 'flagged', 'rejected')),
  reversed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (campaign_id, user_id, source_activity_id)
);
create index campaign_entries_user_idx on campaign_entries (user_id, created_at desc);
create index campaign_entries_campaign_idx on campaign_entries (campaign_id);

-- ----------------------------------------------------------------------------
-- Foreign-key closures for tables referenced before their parents above
-- (none, but we leave this as a guard for future migrations)
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- Seed the activity_types table with the canonical set
-- ----------------------------------------------------------------------------
insert into activity_types (category, display_name, icon) values
  ('pickleball', 'Pickleball', '🥒'),
  ('running', 'Running', '🏃'),
  ('walking', 'Walking', '🚶'),
  ('basketball', 'Basketball', '🏀'),
  ('hiking', 'Hiking', '🥾'),
  ('cycling', 'Cycling', '🚴'),
  ('tennis', 'Tennis', '🎾'),
  ('golf', 'Golf', '⛳'),
  ('general_fitness', 'General fitness', '💪'),
  ('other', 'Other', '✨');

-- ----------------------------------------------------------------------------
-- Seed the wearable_providers table
-- ----------------------------------------------------------------------------
insert into wearable_providers (id, display_name, oauth_required, is_enabled) values
  ('phone',           'Phone',           false, true),
  ('apple_health',    'Apple Health',    false, true),
  ('apple_watch',     'Apple Watch',     false, true),
  ('health_connect',  'Health Connect',  false, true),
  ('fitbit',          'Fitbit',          true,  true),
  ('garmin',          'Garmin',          true,  true),
  ('samsung_health',  'Samsung Health',  false, true),
  ('oura',            'Oura',            true,  true),
  ('whoop',           'WHOOP',           true,  true),
  ('manual',          'Manual entry',    false, true);
