# Security & RLS

## Threat model (Phase 0 scope)

| Threat                                     | Mitigation                                                                                                                                                                                                                        |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client tampers with point totals           | `point_transactions` is INSERT-only from `service_role`. Clients cannot UPDATE or DELETE. All scoring is server-side.                                                                                                             |
| User reads another user's wearable metrics | `wearable_metrics` is RLS owner-only. No social surface ever joins it.                                                                                                                                                            |
| User reads another group's private data    | `groups`, `group_members`, `group_invites` use a "member-or-invited-or-public" policy; pending invites hide the group name.                                                                                                       |
| User submits fake activities               | `activities` are INSERT-allowed by owner, but `verification_status` is server-set via Edge Functions; only verified entries post to `point_transactions`.                                                                         |
| User submits fake giveaway entries         | `campaign_entries` INSERT restricted, UNIQUE `(campaign_id, user_id, source_activity_id)` prevents duplicate entries from a single activity.                                                                                      |
| Live location leak                         | `activity_location_samples` RLS grants only the owner and an explicit list of authorized viewers. Realtime channel is scoped per session.                                                                                         |
| Service role leak to client                | `service_role` is never in `EXPO_PUBLIC_*` and is loaded only by Edge Functions / migrations.                                                                                                                                     |
| OAuth token theft                          | Provider tokens are stored in `wearable_connections.access_token` and `refresh_token` columns that are encrypted at rest via `pgsodium`; the column is RLS owner-only and never returned to the client after the initial connect. |

## RLS policy catalog (full coverage)

Every multi-tenant table has policies for `SELECT`, `INSERT`, `UPDATE`, `DELETE` (where applicable). The pgTAP test in `supabase/tests/rls.test.sql` exercises each policy with positive and negative cases.

| Table                       | SELECT                                                            | INSERT                                                | UPDATE                | DELETE                         |
| --------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------- | --------------------- | ------------------------------ |
| `profiles`                  | self + members of shared groups + active viewers of live activity | self (auth trigger)                                   | self                  | —                              |
| `friendships`               | involved users                                                    | self                                                  | self (status)         | self                           |
| `groups`                    | members + invited                                                 | any auth user                                         | owner / admin         | owner                          |
| `group_members`             | members                                                           | group owner / admin                                   | self (leave)          | self / admin                   |
| `group_invites`             | inviter + invitee (after accept)                                  | group member                                          | inviter (revoke)      | inviter / admin                |
| `activity_types`            | public read                                                       | admin                                                 | admin                 | admin                          |
| `activities`                | self + group members (per sharing level)                          | self (verification_status default 'manually_entered') | server (service_role) | self (cancel only)             |
| `activity_participants`     | self + group members (per activity sharing level)                 | self or group admin                                   | self                  | self                           |
| `activity_location_samples` | self + explicit `authorized_viewer` rows                          | self via service                                      | —                     | self                           |
| `activity_source_records`   | self                                                              | service_role                                          | service_role          | service_role                   |
| `wearable_providers`        | public read                                                       | admin                                                 | admin                 | admin                          |
| `wearable_connections`      | self                                                              | self                                                  | self                  | self (disconnect)              |
| `wearable_imports`          | self                                                              | service_role                                          | service_role          | service_role                   |
| `wearable_metrics`          | self                                                              | service_role                                          | —                     | service_role                   |
| `sync_jobs`                 | self                                                              | self                                                  | self                  | self                           |
| `point_transactions`        | self (read own)                                                   | service_role                                          | —                     | — (no deletion; reversal only) |
| `leaderboard_snapshots`     | group members / public per challenge                              | server                                                | —                     | —                              |
| `challenges`                | eligible users / public per visibility                            | group owner / admin                                   | group owner / admin   | owner                          |
| `challenge_participants`    | self + group members                                              | self                                                  | self                  | self                           |
| `challenge_progress`        | self + group members                                              | service_role                                          | service_role          | —                              |
| `campaigns`                 | eligible users                                                    | admin                                                 | admin                 | admin                          |
| `prizes`                    | campaign readers                                                  | admin                                                 | admin                 | admin                          |
| `sponsors`                  | campaign readers                                                  | admin                                                 | admin                 | admin                          |
| `campaign_entries`          | self + admin                                                      | self                                                  | — (no client updates) | — (reversals are new rows)     |
| `reactions`                 | activity readers                                                  | self                                                  | self                  | self                           |
| `comments`                  | activity readers                                                  | self                                                  | self                  | self                           |
| `notifications`             | self                                                              | service_role                                          | self (mark read)      | self                           |
| `reports`                   | self                                                              | self                                                  | admin                 | admin                          |
| `blocked_users`             | self                                                              | self                                                  | —                     | self                           |
| `audit_logs`                | admin                                                             | service_role                                          | —                     | —                              |

## Test coverage

`supabase/tests/rls.test.sql` (pgTAP) covers at minimum:

- A user can SELECT their own `profiles` row and cannot SELECT another user's.
- A user cannot INSERT into `point_transactions` as themselves.
- A non-member cannot SELECT a private `groups` row.
- A non-invited user cannot SELECT a `group_invites` row.
- A non-owner cannot SELECT another user's `wearable_metrics`.
- `activities` with `sharing_level = 'private'` is only visible to the owner.
- `activity_location_samples` is only visible to the owner and authorized viewers.

The CI workflow `rls` job spins up `supabase start`, applies migrations, and runs this test on every PR.

## Secret handling

| Secret                          | Where it lives                             | Never goes to                |
| ------------------------------- | ------------------------------------------ | ---------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | `.env` (local), Expo public env (prod)     | —                            |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `.env` (local), Expo public env (prod)     | —                            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase Edge Function env, admin scripts  | client, repo, screenshots    |
| Provider OAuth client secrets   | Supabase Edge Function env (encrypted)     | client, repo                 |
| Provider access/refresh tokens  | `wearable_connections` (encrypted at rest) | client after initial connect |
| APNs / FCM                      | Expo / EAS submission config               | repo                         |

## Reporting

Found a security issue? Email `security@strive.app` (placeholder until a real address is provisioned). Do not file a public GitHub issue.
