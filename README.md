# Rally Mobile

**Phase 0 — Foundation scaffold**

Rally is a phone-first, wearable-compatible social-activity app. Private friend groups, recreational sports, activity challenges, verified points, and activity-specific giveaways. Pickleball is the first activity category; the architecture supports running, walking, basketball, hiking, cycling, tennis, golf, general fitness, and other recreational activities without schema churn.

This repository is **fully independent** of Strive, MedClear, or any other product. It has its own Supabase project, environment variables, deployment, and documentation.

> **Status: Phase 0.** Placeholder UI flows are wired to a typed Supabase schema with strict Row Level Security. Authentication, real group CRUD, real activity sessions, and wearable integrations are not yet implemented — they land in Phase 1+ per `docs/ROADMAP.md`.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp env.example .env
# Edit .env: set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
# (You must have a separate Supabase project. Do NOT reuse the Strive or MedClear project.)

# 3. Apply database migrations + seed
npx supabase start                       # local Postgres + Auth + Realtime
npx supabase db reset                    # apply migrations (NEVER against prod)

# 4. Run the mobile app
#    Requires Expo dev client — Expo Go does NOT support HealthKit / Health Connect.
npx expo prebuild --clean
npx expo run:ios          # iOS simulator
npx expo run:android      # Android emulator
```

See `docs/SETUP.md` for the full contributor setup, including Apple Developer account, Google Play Console, and device permission requirements.

---

## What works today (Phase 0)

- Expo + TypeScript + Expo Router app shell with **typed routes**.
- Primary tab navigation: **Home / Groups / Start / Challenges / Profile**.
- Placeholder screens for: Welcome, Sign up, Login, Profile onboarding, Home feed, Group list, Create group, Join group, Invite friends, Group dashboard, Group members, Leaderboard, Challenge list, Challenge details, Start activity, Active activity session, Session summary, Activity history, Connected Devices and Apps, Provider permissions, Imported activity review, Duplicate activity resolution, Notifications, Profile, Privacy settings.
- Supabase client wired with env-driven config and SecureStore-based session persistence.
- **Complete database schema** for the full product, including all 31 tables requested, with enums, indexes, and foreign keys.
- **Row Level Security** enabled on every multi-tenant table. Policies are exercised by automated pgTAP tests.
- **Wearable provider abstraction** with placeholder adapters for Phone, Apple Health, Health Connect, Garmin, Fitbit, Oura, and WHOOP. Real implementations land in Phase 4/9.
- **Server-controlled point ledger** with reversal semantics and admin-only mutation.
- CI: `tsc`, `eslint`, `prettier`, `jest`, `supabase db lint`, and RLS pgTAP tests on every PR.

## What does NOT work yet (Phase 1+)

- Real auth (sign-up, login, password reset) — placeholder only.
- Real group CRUD — placeholder.
- Real activity session recording — placeholder.
- Real wearable data import — placeholder.
- Real push notifications — placeholder.

**No screen in the app should be considered a finished product surface.** All flows use typed mock data and clearly label placeholder content in development builds.

---

## Documentation index

| File                           | Purpose                                                  |
| ------------------------------ | -------------------------------------------------------- |
| `docs/ARCHITECTURE.md`         | Service layers, data model, wearable abstraction         |
| `docs/SECURITY_RLS.md`         | RLS policy catalog + threat model                        |
| `docs/WEARABLES.md`            | Provider adapter contract, priority, duplicate detection |
| `docs/ROADMAP.md`              | Phases 1–9 with deliverables and exit criteria           |
| `docs/SETUP.md`                | Contributor setup, iOS/Android tooling, common pitfalls  |
| `docs/CONTRIBUTING.md`         | Commit standards, branch policy, PR review               |
| `supabase/README.md`           | DB workflow, migrations, seed, lint, RLS tests           |
| `services/wearables/README.md` | How to add a new provider                                |

---

## Hard project rules

1. **No shared infrastructure** with Strive, MedClear, or any other product. New Supabase project, new env files, new deploy targets.
2. **No secrets in source.** Only `EXPO_PUBLIC_*` values reach the client. Service-role keys, provider OAuth secrets, APNs/FCM credentials live in admin/Edge Function env only.
3. **Server controls the truth.** Point totals, challenge completion, verification levels, and giveaway entry counts are computed server-side via a `point_transactions` ledger. Clients submit facts, not totals.
4. **Sensitive data isolated.** `wearable_metrics`, `activity_location_samples`, and `activity_source_records` are RLS-locked tighter than social tables.
5. **No ranking by HRM or calories.** Initial leaderboards rank on verified active minutes, completed sessions, and streaks.
6. **Phone-first.** Every flow must work without a wearable. Wearable connections are optional enhancements.
7. **Linting and tests are gates, not suggestions.** PRs fail CI if `tsc`, `eslint`, `prettier`, `jest`, or RLS tests regress.

---

## License

MIT — see `LICENSE`.
