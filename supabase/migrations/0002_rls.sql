-- ============================================================================
-- 0002_rls.sql — Row Level Security for every multi-tenant table
--
-- All policies assume `auth.uid()` is the authenticated user. Service-role
-- writes (point_transactions, leaderboard_snapshots, wearable_imports, etc.)
-- are INSERT/UPDATE/DELETE only by service_role and never from the client.
-- ============================================================================

-- Enable RLS on every table that contains user data.
alter table profiles enable row level security;
alter table friendships enable row level security;
alter table blocked_users enable row level security;
alter table reports enable row level security;
alter table reactions enable row level security;
alter table comments enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table group_invites enable row level security;
alter table activity_types enable row level security;
alter table activities enable row level security;
alter table activity_participants enable row level security;
alter table activity_location_samples enable row level security;
alter table activity_source_records enable row level security;
alter table wearable_providers enable row level security;
alter table wearable_connections enable row level security;
alter table wearable_imports enable row level security;
alter table wearable_metrics enable row level security;
alter table sync_jobs enable row level security;
alter table point_transactions enable row level security;
alter table leaderboard_snapshots enable row level security;
alter table challenges enable row level security;
alter table challenge_participants enable row level security;
alter table challenge_progress enable row level security;
alter table sponsors enable row level security;
alter table prizes enable row level security;
alter table campaigns enable row level security;
alter table campaign_entries enable row level security;

-- Helper: is the current user a member of the given group?
create or replace function public.is_group_member(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from group_members gm
    where gm.group_id = gid
      and gm.user_id = auth.uid()
      and gm.removed_at is null
  );
$$;

-- Helper: is the current user invited to the given group with a pending invite?
create or replace function public.is_group_invitee(gid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from group_invites gi
    where gi.group_id = gid
      and gi.invitee_id = auth.uid()
      and gi.status = 'pending'
      and gi.expires_at > now()
  );
$$;

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
create policy profiles_select_self_or_group on profiles
  for select using (
    id = auth.uid()
    or exists (
      select 1 from group_members gm
      where gm.user_id = profiles.id
        and gm.removed_at is null
        and public.is_group_member(gm.group_id)
    )
  );

create policy profiles_insert_self on profiles
  for insert with check (id = auth.uid());

create policy profiles_update_self on profiles
  for update using (id = auth.uid()) with check (id = auth.uid() and is_admin = (select is_admin from profiles where id = auth.uid()));

-- ----------------------------------------------------------------------------
-- friendships
-- ----------------------------------------------------------------------------
create policy friendships_select_involved on friendships
  for select using (requester_id = auth.uid() or addressee_id = auth.uid());
create policy friendships_insert_self on friendships
  for insert with check (requester_id = auth.uid());
create policy friendships_update_involved on friendships
  for update using (requester_id = auth.uid() or addressee_id = auth.uid());
create policy friendships_delete_self on friendships
  for delete using (requester_id = auth.uid() or addressee_id = auth.uid());

-- ----------------------------------------------------------------------------
-- blocked_users
-- ----------------------------------------------------------------------------
create policy blocked_users_self_select on blocked_users for select using (blocker_id = auth.uid());
create policy blocked_users_self_insert on blocked_users for insert with check (blocker_id = auth.uid());
create policy blocked_users_self_delete on blocked_users for delete using (blocker_id = auth.uid());

-- ----------------------------------------------------------------------------
-- reports
-- ----------------------------------------------------------------------------
create policy reports_select_self_or_admin on reports
  for select using (reporter_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));
create policy reports_insert_self on reports for insert with check (reporter_id = auth.uid());
create policy reports_update_admin on reports
  for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- ----------------------------------------------------------------------------
-- reactions
-- ----------------------------------------------------------------------------
create policy reactions_select_authorized on reactions
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from activities a
      where a.id = reactions.activity_id
        and (
          a.user_id = auth.uid()
          or (a.group_id is not null and public.is_group_member(a.group_id))
        )
    )
  );
create policy reactions_insert_self on reactions for insert with check (user_id = auth.uid());
create policy reactions_delete_self on reactions for delete using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- comments
-- ----------------------------------------------------------------------------
create policy comments_select_authorized on comments
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from activities a
      where a.id = comments.activity_id
        and (
          a.user_id = auth.uid()
          or (a.group_id is not null and public.is_group_member(a.group_id))
        )
    )
  );
create policy comments_insert_self on comments for insert with check (user_id = auth.uid());
create policy comments_update_self on comments for update using (user_id = auth.uid() and deleted_at is null);
create policy comments_delete_self on comments for delete using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- notifications
-- ----------------------------------------------------------------------------
create policy notifications_select_self on notifications for select using (user_id = auth.uid());
create policy notifications_update_self on notifications for update using (user_id = auth.uid());
create policy notifications_delete_self on notifications for delete using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- audit_logs: admin-only reads, no client writes
-- ----------------------------------------------------------------------------
create policy audit_logs_select_admin on audit_logs
  for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin));

-- ----------------------------------------------------------------------------
-- groups
-- ----------------------------------------------------------------------------
create policy groups_select_member_or_invitee on groups
  for select using (
    visibility = 'public'
    or public.is_group_member(id)
    or public.is_group_invitee(id)
  );
create policy groups_insert_self on groups for insert with check (owner_id = auth.uid());
create policy groups_update_owner_or_admin on groups
  for update using (
    owner_id = auth.uid()
    or exists (
      select 1 from group_members gm
      where gm.group_id = groups.id
        and gm.user_id = auth.uid()
        and gm.role in ('owner', 'admin')
        and gm.removed_at is null
    )
  );
create policy groups_delete_owner on groups for delete using (owner_id = auth.uid());

-- ----------------------------------------------------------------------------
-- group_members
-- ----------------------------------------------------------------------------
create policy group_members_select_member on group_members
  for select using (public.is_group_member(group_id) or user_id = auth.uid());
create policy group_members_insert_admin on group_members
  for insert with check (
    exists (
      select 1 from group_members gm
      where gm.group_id = group_members.group_id
        and gm.user_id = auth.uid()
        and gm.role in ('owner', 'admin')
        and gm.removed_at is null
    )
  );
create policy group_members_update_admin on group_members
  for update using (
    user_id = auth.uid()
    or exists (
      select 1 from group_members gm
      where gm.group_id = group_members.group_id
        and gm.user_id = auth.uid()
        and gm.role in ('owner', 'admin')
        and gm.removed_at is null
    )
  );
create policy group_members_delete_self_or_admin on group_members
  for delete using (
    user_id = auth.uid()
    or exists (
      select 1 from group_members gm
      where gm.group_id = group_members.group_id
        and gm.user_id = auth.uid()
        and gm.role in ('owner', 'admin')
        and gm.removed_at is null
    )
  );

-- ----------------------------------------------------------------------------
-- group_invites
-- ----------------------------------------------------------------------------
create policy group_invites_select_involved on group_invites
  for select using (
    inviter_id = auth.uid()
    or invitee_id = auth.uid()
    or (invitee_email is not null and invitee_email = (select email from auth.users where id = auth.uid()))
  );
create policy group_invites_insert_member on group_invites
  for insert with check (
    inviter_id = auth.uid()
    and (public.is_group_member(group_id))
  );
create policy group_invites_update_involved on group_invites
  for update using (inviter_id = auth.uid() or invitee_id = auth.uid());
create policy group_invites_delete_inviter on group_invites
  for delete using (inviter_id = auth.uid());

-- ----------------------------------------------------------------------------
-- activity_types: public read
-- ----------------------------------------------------------------------------
create policy activity_types_select_public on activity_types for select using (true);

-- ----------------------------------------------------------------------------
-- activities
-- ----------------------------------------------------------------------------
create policy activities_select_authorized on activities
  for select using (
    user_id = auth.uid()
    or (group_id is not null and sharing_level <> 'private' and public.is_group_member(group_id))
  );
create policy activities_insert_self on activities
  for insert with check (user_id = auth.uid());
create policy activities_update_self on activities
  for update using (user_id = auth.uid() and session_status in ('active', 'paused'))
  with check (user_id = auth.uid());
create policy activities_delete_self on activities
  for delete using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- activity_participants
-- ----------------------------------------------------------------------------
create policy activity_participants_select_authorized on activity_participants
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from activities a
      where a.id = activity_participants.activity_id
        and (
          a.user_id = auth.uid()
          or (a.group_id is not null and public.is_group_member(a.group_id))
        )
    )
  );
create policy activity_participants_insert_self_or_admin on activity_participants
  for insert with check (user_id = auth.uid());
create policy activity_participants_delete_self on activity_participants
  for delete using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- activity_location_samples: most restricted table
-- ----------------------------------------------------------------------------
create policy activity_location_samples_select_owner_or_visible on activity_location_samples
  for select using (
    user_id = auth.uid()
    or (
      is_visible_to_group = true
      and exists (
        select 1 from activities a
        where a.id = activity_location_samples.activity_id
          and a.group_id is not null
          and public.is_group_member(a.group_id)
      )
    )
  );
create policy activity_location_samples_insert_self on activity_location_samples
  for insert with check (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- activity_source_records: owner-only; service writes happen via Edge Function
-- ----------------------------------------------------------------------------
create policy activity_source_records_select_self on activity_source_records
  for select using (
    exists (select 1 from activities a where a.id = activity_source_records.activity_id and a.user_id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- wearable_providers: public read
-- ----------------------------------------------------------------------------
create policy wearable_providers_select_public on wearable_providers for select using (true);

-- ----------------------------------------------------------------------------
-- wearable_connections: owner-only
-- ----------------------------------------------------------------------------
create policy wearable_connections_self on wearable_connections
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- wearable_imports: owner-only
-- ----------------------------------------------------------------------------
create policy wearable_imports_self_select on wearable_imports
  for select using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- wearable_metrics: owner-only, no social surface joins this
-- ----------------------------------------------------------------------------
create policy wearable_metrics_self_select on wearable_metrics
  for select using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- sync_jobs: owner-only
-- ----------------------------------------------------------------------------
create policy sync_jobs_self on sync_jobs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- point_transactions: read own, write only by service_role
-- ----------------------------------------------------------------------------
create policy point_transactions_select_self on point_transactions
  for select using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- leaderboard_snapshots: members of the group can read
-- ----------------------------------------------------------------------------
create policy leaderboard_snapshots_select_member on leaderboard_snapshots
  for select using (public.is_group_member(group_id));

-- ----------------------------------------------------------------------------
-- challenges
-- ----------------------------------------------------------------------------
create policy challenges_select_group_member on challenges
  for select using (public.is_group_member(group_id));
create policy challenges_insert_admin on challenges
  for insert with check (
    created_by = auth.uid()
    and (
      exists (
        select 1 from group_members gm
        where gm.group_id = challenges.group_id
          and gm.user_id = auth.uid()
          and gm.role in ('owner', 'admin')
          and gm.removed_at is null
      )
    )
  );
create policy challenges_update_admin on challenges
  for update using (
    exists (
      select 1 from group_members gm
      where gm.group_id = challenges.group_id
        and gm.user_id = auth.uid()
        and gm.role in ('owner', 'admin')
        and gm.removed_at is null
    )
  );
create policy challenges_delete_owner on challenges
  for delete using (
    exists (
      select 1 from group_members gm
      where gm.group_id = challenges.group_id
        and gm.user_id = auth.uid()
        and gm.role = 'owner'
        and gm.removed_at is null
    )
  );

-- ----------------------------------------------------------------------------
-- challenge_participants
-- ----------------------------------------------------------------------------
create policy challenge_participants_select_authorized on challenge_participants
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from challenges c
      where c.id = challenge_participants.challenge_id
        and public.is_group_member(c.group_id)
    )
  );
create policy challenge_participants_insert_self on challenge_participants
  for insert with check (user_id = auth.uid());
create policy challenge_participants_delete_self on challenge_participants
  for delete using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- challenge_progress
-- ----------------------------------------------------------------------------
create policy challenge_progress_select_authorized on challenge_progress
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from challenges c
      where c.id = challenge_progress.challenge_id
        and public.is_group_member(c.group_id)
    )
  );

-- ----------------------------------------------------------------------------
-- sponsors / prizes: public read for active campaigns
-- ----------------------------------------------------------------------------
create policy sponsors_select_public on sponsors for select using (is_active = true);
create policy prizes_select_public on prizes for select using (true);

-- ----------------------------------------------------------------------------
-- campaigns
-- ----------------------------------------------------------------------------
create policy campaigns_select_active on campaigns
  for select using (
    status = 'active'
    and (visibility <> 'group' or exists (
      select 1 from group_members gm
      where gm.user_id = auth.uid()
        and gm.removed_at is null
    ))
  );

-- ----------------------------------------------------------------------------
-- campaign_entries
-- ----------------------------------------------------------------------------
create policy campaign_entries_select_self_or_admin on campaign_entries
  for select using (
    user_id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
  );
create policy campaign_entries_insert_self on campaign_entries
  for insert with check (user_id = auth.uid());
