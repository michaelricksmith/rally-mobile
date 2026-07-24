# Roadmap

> **You are here: Phase 0 — Foundation.** The schema, RLS, app shell, and wearable abstraction are in place but no real product feature is live. Each phase ends with a Telegram ping summarizing what shipped and what the next step requires.

## Phase 0 — Foundation (this PR)

- New repo scaffold.
- Expo + TypeScript + Expo Router + EAS profiles (dev / preview / production).
- Supabase client wired.
- All 31 tables migrated with enums, indexes, FKs.
- RLS enabled on every multi-tenant table.
- pgTAP test suite for RLS.
- Wearable provider interface + 7 placeholder adapters.
- Server-controlled point ledger service.
- CI: `tsc`, `eslint`, `prettier`, `jest`, RLS tests.
- Docs: ARCHITECTURE, ROADMAP, SETUP, SECURITY_RLS, WEARABLES, CONTRIBUTING.

**Exit criteria**

- [x] `npx tsc --noEmit` clean
- [x] `npx eslint .` clean
- [x] `npx prettier --check` clean
- [x] `npx supabase db lint` clean
- [x] `npx jest` green
- [x] RLS test suite green
- [x] No real secrets in repo

## Phase 1 — Auth + Profile

- Real Supabase Auth (email, Apple, Google).
- Email verification + magic link.
- Profile onboarding (display name, avatar, preferred units, region).
- Privacy defaults page.
- Audit log entries for sign-in / sign-up / privacy changes.

## Phase 2 — Groups + Invitations

- Create / edit / delete group.
- Roles: owner / admin / member.
- Invite codes, share links, QR codes, deep links.
- Pending / accepted / declined / revoked states.
- Group dashboard + member list.
- Push notification scaffold (Expo push, APNs + FCM at device-test time).

## Phase 3 — Phone-based Activity

- Session start / pause / resume / finish / cancel.
- Activity timer, motion + location sampling.
- Session summary.
- Activity history per user.
- Anti-cheat minimums: max session length, motion threshold, GPS-jump detection.

## Phase 4 — Health Platform Integrations

- Apple HealthKit adapter (read workouts, HR, steps, distance, energy).
- Android Health Connect adapter.
- Permission flow + Connected Devices and Apps screen.
- Workout import.
- Duplicate detection (user + activity + time window + provider ID).
- Imported activity review + resolution UI.

## Phase 5 — Points + Leaderboards

- Server-side scoring (Edge Function, not client).
- `point_transactions` ledger with reversal semantics.
- Daily / weekly / monthly / all-time / current-challenge leaderboards.
- Streaks.
- Verification indicators on leaderboard rows.

## Phase 6 — Challenges

- Create / join / track / complete challenges.
- Group goals.
- Challenge leaderboard.
- Accepted-source + required-verification rules.

## Phase 7 — Giveaways + Campaigns

- Configurable campaigns, prizes, sponsors.
- Entry ledger (one row per entry, not just a counter).
- Eligibility rules (region, age, source, verification).
- Admin winner flow.

## Phase 8 — Live Social Activity

- Live active-user presence.
- Approximate map position.
- Authorized viewers.
- Realtime reactions.
- Battery + location smoothing.

## Phase 9 — Direct Wearable Providers

- Garmin Health API adapter.
- Fitbit Web API adapter.
- Oura Cloud API adapter.
- WHOOP Developer API adapter.
- Each behind the shared `WearableProvider` interface.

---

## Anti-goals (deliberately deferred)

- Native watch app for Apple Watch (after stable phone MVP).
- Public discovery feed.
- Direct messaging.
- Payments / payouts (giveaways are awarded off-platform until legal review).
- HRM- or calorie-based ranking.
