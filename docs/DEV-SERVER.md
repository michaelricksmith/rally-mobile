# Dev server + device walkthrough

**Generated after Phase 0 scaffold.** Use this after the Android EAS dev build APK is installed on your phone.

## One-time: start the dev server

From the project directory:

```powershell
cd "C:\Users\bookm\OneDrive\Desktop\rally-mobile-scaffold\rally-mobile"
npx expo start --dev-client --tunnel
```

What happens:

- Metro bundler starts on your laptop.
- `--tunnel` opens an `exp://u.expo.dev/...` URL that works on any network (no need to be on the same Wi-Fi as your phone).
- The terminal prints a QR code.

## Connect the phone

1. Open the **Rally** app on your Android phone (the APK you installed from the EAS build).
2. Tap **"Enter URL manually"** if no QR scanner is visible, or use the camera to scan the QR code printed in the terminal.
3. The app connects to the dev server. The first bundle download takes 10–30 seconds; subsequent reloads are instant.

If the QR code is not visible, copy the `exp://u.expo.dev/...` URL from the terminal and paste it into the "Enter URL manually" screen inside the Rally dev client.

## Walkthrough order (placeholder mode, no Supabase required)

The app boots without `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Every screen renders with hard-coded placeholder data. A single warning will print in the dev server log: `[supabase] EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY is missing.`

| #   | Screen            | What to verify                                                                                          |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | Welcome           | Title says "Rally". Green "Get started" button is visible.                                              |
| 2   | Sign up           | Heading "Create your account". Placeholder text mentions Phase 1.                                       |
| 3   | Onboarding        | Heading "Set up your profile". "Save and continue" lands in tab nav.                                    |
| 4   | Home tab          | Greeting "Welcome to Rally". Three placeholder cards. Pull-to-refresh works.                            |
| 5   | Groups tab        | List shows "Sunday Pickup" + "Trail Crew". "+ New group" button.                                        |
| 6   | Create group      | Heading "Create a group". Form fields render. "Create" returns to Groups.                               |
| 7   | Join with code    | "Join a group" form. Single text field for invite code.                                                 |
| 8   | Start tab         | 9-tile grid (pickleball, running, walking, basketball, hiking, cycling, tennis, golf, general fitness). |
| 9   | Pickleball start  | "Start pickleball" + source/sharing placeholders. "Start" advances to session.                          |
| 10  | Active session    | Timer reads 00:00:00. Pause / Cancel / Finish buttons render.                                           |
| 11  | Finish → Summary  | Six summary rows render with "—" placeholders.                                                          |
| 12  | Challenges tab    | Empty leaderboard card.                                                                                 |
| 13  | Profile tab       | Rally title. Two rows: Connected devices and Privacy.                                                   |
| 14  | Connected devices | Lists 7 providers. Each marked "Coming soon".                                                           |
| 15  | Privacy           | Five sharing-level bullets render.                                                                      |

If any of these break, capture the error text (the dev server prints JS errors with red stack traces) and send it back.

## Stopping the server

`Ctrl+C` in the terminal. The dev client on the phone will go offline and show "Could not connect to development server" until you restart it.

## Common gotchas

| Symptom                         | Cause                               | Fix                                                             |
| ------------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| Phone shows "Could not connect" | Dev server not running              | Start it (see above)                                            |
| Phone shows "Could not connect" | Tunnel URL expired or laptop asleep | Restart with `--tunnel`                                         |
| "Module not found" red screen   | Stale Metro cache                   | `npx expo start --clear`                                        |
| First bundle takes 30+ seconds  | Normal — first bundle is large      | Wait it out                                                     |
| Hot reload stops working        | Watchman issue on Windows           | `npx expo start --tunnel --no-dev --minify` and reload manually |
