# Wearables

Rally is **phone-first**. Connecting a wearable is always optional. When a user does connect a provider, Rally ingests the provider's workout data through a single normalized interface so the rest of the app stays provider-agnostic.

## Provider priority

When multiple sources describe the same workout, Rally keeps the highest-priority source:

1. `rally_live_verified` — an active in-app session (the user is using Rally right now).
2. `wearable_verified` — a connected provider that has a valid external ID and matches a time window.
3. `health_platform_imported` — Apple HealthKit or Android Health Connect.
4. `direct_provider_import` — direct Garmin / Fitbit / Oura / WHOOP API.
5. `phone_verified` — phone-only session (motion + location).
6. `manually_entered` — typed by the user.

Rally does not silently merge sources. Duplicate detection runs on every import and surfaces a "Choose the correct record" UI when conflict is detected.

## Provider interface

All adapters implement `WearableProvider` in `services/wearables/types.ts`:

```ts
export interface WearableProvider {
  readonly id: WearableProviderId;
  readonly displayName: string;
  readonly requiresOAuth: boolean;
  requestConnection(): Promise<ProviderConnectionResult>;
  listWorkouts(since: Date): Promise<NormalizedWorkout[]>;
  disconnect(): Promise<void>;
  onWorkout(handler: (workout: NormalizedWorkout) => void): () => void;
}
```

`NormalizedWorkout` is the contract every consumer in the app depends on:

```ts
export interface NormalizedWorkout {
  providerId: WearableProviderId;
  externalId: string;
  activityCategory: ActivityCategory;
  startedAt: string; // ISO-8601 UTC
  endedAt: string; // ISO-8601 UTC
  activeSeconds: number;
  steps?: number;
  distanceMeters?: number;
  activeEnergyKcal?: number;
  avgHeartRateBpm?: number;
  maxHeartRateBpm?: number;
  speedMetersPerSecond?: number;
  elevationGainMeters?: number;
  routeAvailable: boolean;
  rawProviderMetadata: Record<string, unknown>;
  verificationStatus: VerificationStatus;
}
```

## Adapters included in Phase 0 (all stubs)

| Adapter                 | Status | Notes                                                                       |
| ----------------------- | ------ | --------------------------------------------------------------------------- |
| `PhoneProvider`         | stub   | reads `expo-location` + `expo-sensors`; not yet wired                       |
| `AppleHealthProvider`   | stub   | requires `expo-dev-client` + native HealthKit module; not yet wired         |
| `HealthConnectProvider` | stub   | requires `expo-dev-client` + community Health Connect module; not yet wired |
| `GarminProvider`        | stub   | OAuth + Health API; server-side token exchange                              |
| `FitbitProvider`        | stub   | OAuth 2.0 + Web API; server-side token exchange                             |
| `OuraProvider`          | stub   | OAuth 2.0 + Cloud API; server-side token exchange                           |
| `WhoopProvider`         | stub   | OAuth 2.0 + Developer API; server-side token exchange                       |

Each stub returns an empty workout list and is clearly labeled in the UI as "Coming soon." No file in the repo should imply that HealthKit, Health Connect, or a direct provider is functional until Phase 4 / Phase 9.

## Duplicate detection

Triggered on every import. Two workouts are considered duplicates when:

- same user, AND
- same `activityCategory`, AND
- time windows overlap by more than 60%, AND
- duration is within ±10%, AND
- distance (when present) is within ±15%, OR
- they share a provider's `externalId` (same source).

When a duplicate is detected, Rally keeps the highest-priority source and writes a row to `wearable_imports` with `import_status = 'duplicate_resolved'`. The lower-priority row is flagged in `activity_source_records`.

## Verification ladder

`VerificationStatus` is an enum and is set server-side:

- `rally_live_verified` — set when an in-app session is finished.
- `wearable_verified` — set when an import matches a provider external ID and falls inside a time window.
- `health_platform_imported` — set when imported from HealthKit or Health Connect.
- `phone_verified` — set when a phone session has at least one motion sample or one location sample inside the active window.
- `manually_entered` — default for user-typed entries.
- `flagged` — set by Edge Function when a basic anti-cheat check fails (GPS jump, impossible duration, etc.).
- `invalidated` — set by admin or by duplicate resolution.

Challenge progress and giveaway eligibility check `verification_status`. A manually-entered activity may count for a casual group challenge but not for a sponsored giveaway that requires verified activity.

## Adding a new provider

1. Add an entry to `wearable_providers` via a new migration.
2. Create `services/wearables/adapters/<provider>.ts` implementing `WearableProvider`.
3. Register it in `services/wearables/registry.ts`.
4. Add an OAuth flow via a Supabase Edge Function (token exchange + storage).
5. Add RLS test coverage if new tables are introduced.
6. Add an issue using the `feature` template.
