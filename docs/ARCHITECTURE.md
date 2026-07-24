# Architecture

## High-level

```
┌──────────────────────────────────────────────────────────────────┐
│                          Mobile app (Expo)                       │
│                                                                  │
│  Expo Router screens  ─▶  React state  ─▶  Service layer         │
│                                                  │               │
│                                                  ▼               │
│                                        @supabase/supabase-js     │
│                                                  │               │
│  HealthKit  ◀── native bridge ──▶  AppleHealthProvider (stub)    │
│  Health Connect ◀── native bridge ─▶  HealthConnectProvider (stub│
│  Garmin / Fitbit / Oura / WHOOP ──▶  direct OAuth adapters       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Supabase (Postgres)                        │
│                                                                  │
│  PostgREST  ◀──  RLS policies  ◀──  pgTAP test suite             │
│  Realtime   ◀──  presence / live session status                  │
│  Storage    ◀──  avatars, public group images                    │
│  Edge Fn    ◀──  point ledger, server-side scoring,              │
│                  provider token exchange, push fan-out           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Folder layout

```
rally-mobile/
├── app/                    Expo Router file-based routes
│   ├── (auth)/             login, signup, onboarding
│   ├── (tabs)/             Home / Groups / Start / Challenges / Profile
│   ├── group/              group detail flows
│   ├── activity/           session start / active / summary
│   ├── challenges/         challenge detail / progress
│   └── profile/            settings, connected devices, privacy
├── components/             shared UI
├── constants/              app-wide constants (group caps, scoring rules, app name)
├── lib/
│   └── supabase/           Supabase client + env loader
├── services/
│   ├── wearables/          provider interface + adapters
│   ├── points/             point rules + ledger adapter
│   ├── maps/               map + location services (react-native-maps today, Mapbox-ready)
│   └── notifications/      Expo push, APNs/FCM bridge
├── supabase/
│   ├── migrations/         SQL migrations (apply with supabase db reset)
│   ├── tests/              pgTAP RLS test suite
│   ├── seed.sql            local-only seed (NEVER against prod)
│   └── config.toml         local Supabase project config
├── types/                  generated DB types + shared types
├── docs/                   ARCHITECTURE / ROADMAP / SETUP / etc.
└── __tests__/              unit tests
```

## Data model (summary)

The full schema is in `supabase/migrations/0001_init.sql`. The 31 tables cluster into five domains:

| Domain            | Tables                                                                                                                                                             | Notes                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Identity & social | `profiles`, `friendships`, `blocked_users`, `notifications`, `reports`, `reactions`, `comments`, `audit_logs`                                                      | RLS by `auth.uid()`.                                                                                |
| Groups            | `groups`, `group_members`, `group_invites`                                                                                                                         | RLS only to members or invited users.                                                               |
| Activity          | `activity_types`, `activities`, `activity_participants`, `activity_location_samples`, `activity_source_records`                                                    | `activity_location_samples` is the most restricted table — only owner + explicitly granted viewers. |
| Wearables         | `wearable_providers`, `wearable_connections`, `wearable_imports`, `wearable_metrics`, `sync_jobs`                                                                  | `wearable_metrics` is RLS owner-only and not exposed via any social query.                          |
| Competition       | `point_transactions`, `leaderboard_snapshots`, `challenges`, `challenge_participants`, `challenge_progress`, `campaigns`, `prizes`, `sponsors`, `campaign_entries` | Point totals are derived; `point_transactions` is append-only.                                      |

## Service layer

- `services/wearables` is the **only** place that knows provider-specific shapes. Everything else (leaderboards, challenges, points, UI) talks to a normalized `NormalizedWorkoutRecord`.
- `services/points` is read-only on the client. Writing to `point_transactions` is gated to `service_role` and Edge Functions.
- `services/maps` is the only place that imports `react-native-maps`. The interface accepts a `MapProvider` token so we can swap to Mapbox without touching activity records.
- `services/notifications` wraps `expo-notifications` and centralizes permission requests and channel registration.

## Verification model

Every activity has exactly one `verification_status`:

- `rally_live_verified` — recorded by an active in-app session.
- `wearable_verified` — sourced from a connected provider with a valid external ID and timestamp window.
- `health_platform_imported` — sourced from HealthKit or Health Connect.
- `phone_verified` — phone-only session with motion/location samples.
- `manually_entered` — typed by the user.
- `flagged` — failed basic anti-cheat.
- `invalidated` — admin-invalidate or duplicate suppressed.

This is enforced by an enum and read on every leaderboard query, challenge progress check, and giveaway eligibility check.

## Why no shared package with Strive / MedClear

Each product has its own:

- Supabase project (separate DB, separate anon keys, separate service role).
- `env.example` and CI secrets.
- EAS build profile.
- Push notification project (Expo project + APNs/FCM credentials).
- Encrypted provider OAuth credentials.

If a future shared `utils` package becomes useful, it would live in a **separate repository** (e.g. `strive-shared-types`) and be consumed as a versioned dependency — never copied across products.
