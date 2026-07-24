# Build verification checklist

Run after the Android EAS development build finishes. Used to confirm the artifact is what we expect before handing the APK link to Michael.

## Inputs

- EAS build page URL
- Final build status (`✔ Build finished` or error)
- APK artifact URL
- Any error / warning lines from the build log

## Checks

### 1. Build status

- [ ] `Build finished` is present in the final status line
- [ ] No `Build failed` or `Build canceled`
- [ ] No orange "warnings" in the final 20 lines of the build log

### 2. Package identifier

- [ ] `eas.json` `development` profile produces `com.strive.rallymobile` (confirmed at build time)
- [ ] `app.json → expo.android.package` = `com.strive.rallymobile`
- [ ] `expo-dev-client` is in the resolved plugin list (visible in the gradle log)

### 3. APK metadata (read from EAS build page or with `aapt2 dump badging` if the file is local)

- [ ] `package: name='com.strive.rallymobile'`
- [ ] `application-label: 'Rally'`
- [ ] `sdkVersion` matches the Expo 51 / RN 0.74 baseline (minSdkVersion 24, targetSdkVersion 34)
- [ ] `uses-permission` includes `android.permission.ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`, `ACTIVITY_RECOGNITION`, `POST_NOTIFICATIONS` (configured in `app.json → expo.android.permissions`)

### 4. Bundle contents

- [ ] No string match for `SUPABASE_SERVICE_ROLE_KEY` in the bundle (security smoke test)
- [ ] No string match for any Supabase project URL other than the placeholder
- [ ] `expo-dev-client` is referenced (search for `expo-dev-client` in the bundle metadata)

### 5. Signing

- [ ] APK is signed (debug keystore is fine for an internal dev build)
- [ ] SHA-256 of signing cert is the EAS-managed debug cert

### 6. Size

- [ ] APK size is < 100 MB (typical dev build: 60–80 MB)

## Handoff to Michael

Once every box is checked, send Michael:

- The EAS build page URL
- The APK artifact URL
- A one-line confirmation: `package=com.strive.rallymobile, signed, includes expo-dev-client`
- The `docs/DEV-SERVER.md` walkthrough steps
- The exact command: `npx expo start --dev-client --tunnel`

If any check fails, file a `db:` or `chore:` PR to fix the root cause and re-run the build.
