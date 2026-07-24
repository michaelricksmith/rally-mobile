# Setup

## Prerequisites

- **Node 20.x** (`nvm install 20 && nvm use 20`).
- **npm 10.x** (comes with Node 20).
- **Git**.
- **Supabase CLI** (`npm i -g supabase`).
- **Expo CLI** (`npm i -g expo` or use `npx`).
- **EAS CLI** (`npm i -g eas-cli`) for builds.

### iOS

- macOS with **Xcode 15+**.
- **CocoaPods** (`sudo gem install cocoapods`).
- **Apple Developer account** ($99/yr) — required for TestFlight, push, and HealthKit on a real device.
- iOS simulator 16+ (Xcode ships one).

### Android

- **Android Studio** (Hedgehog or later).
- **JDK 17** (`brew install --cask zulu@17` on macOS, or via Android Studio).
- An Android emulator (Pixel 7 / API 34 recommended) or a physical device with USB debugging.
- **Google Play Console** account ($25 one-time) before submitting.

> **Expo Go is NOT supported.** HealthKit, Health Connect, and most production modules require an Expo dev build. `npx expo run:ios` / `npx expo run:android` builds and installs a dev client locally; `eas build --profile preview` produces an installable internal build for TestFlight / internal testing.

## First-time setup

```bash
# 1. Clone the repo
git clone https://github.com/michaelricksmith/rally-mobile.git
cd rally-mobile

# 2. Install JS deps
npm install

# 3. Configure environment
cp env.example .env
# Edit .env: set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.
# You must use a NEW Supabase project. Do NOT reuse the Strive or MedClear one.

# 4. Boot local Supabase
npx supabase start

# 5. Apply migrations + seed (local only, NEVER against prod)
npx supabase db reset

# 6. Run the mobile app
npx expo prebuild --clean
npx expo run:ios       # or run:android
```

## Common pitfalls

| Symptom                                           | Cause                                     | Fix                                                                           |
| ------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| `MissingSupabaseUrl` at runtime                   | `.env` not populated                      | Copy `env.example` and set `EXPO_PUBLIC_SUPABASE_URL`                         |
| HealthKit permission prompt never appears         | Running in Expo Go                        | Use `expo run:ios` (dev build)                                                |
| Android location request returns nothing          | `ACCESS_BACKGROUND_LOCATION` not declared | Check `app.json` → `android.permissions`                                      |
| `supabase` CLI not found                          | Not installed globally                    | `npm i -g supabase`                                                           |
| `tsc` errors in `src/types/database.generated.ts` | Regenerated types not present             | `npx supabase gen types typescript --local > src/types/database.generated.ts` |
| `supabase db reset` wipes the cloud               | Read the warning                          | Reset only runs locally; cloud projects are never reset by the CLI            |

## Branch policy

- `main` is protected. Direct pushes are blocked.
- One feature per branch: `feat/<short-name>`, `fix/<short-name>`, `db/<short-name>`, `rls/<short-name>`.
- Squash-merge to `main` after CI is green and one reviewer approves.
- Conventional commit messages enforced via `commitlint` (husky hook).

## Testing the loop

1. `npx expo run:ios` (or `run:android`).
2. Tap **Get started** on Welcome.
3. The placeholder Sign-up screen will appear — auth is Phase 1.
4. Tap the **Groups** tab to see the placeholder Group list.
5. Tap **+ Create group** to see the placeholder Create-group screen.
6. Use the **Start** tab to see the placeholder Start-activity screen.
7. Tap the **Profile** tab → **Connected devices** to see the list of stub providers labeled "Coming soon."

This proves the navigation, theming, env wiring, and Supabase client are healthy end-to-end. No real activity is recorded yet.
