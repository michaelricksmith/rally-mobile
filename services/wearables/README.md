# Wearables service

Public surface: `getProvider`, `listProviders`, and the `WearableProvider` interface in `types.ts`.

- Every adapter is a stub in Phase 0. Real implementations land in Phase 4 (HealthKit, Health Connect) and Phase 9 (Garmin, Fitbit, Oura, WHOOP).
- Provider priority is enforced by the import pipeline, not the registry.
- The registry is the only file the UI touches when listing providers.
