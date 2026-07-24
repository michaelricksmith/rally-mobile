/**
 * Notifications service. Wraps expo-notifications and centralizes
 * permission requests, channel registration, and token storage.
 *
 * APNs / FCM credentials are NOT configured in Phase 0. Real device push
 * arrives in Phase 2 once the Expo project + EAS submission profile is set.
 *
 * Web is not supported by expo-notifications. On web, all functions in this
 * module are no-ops and `registerForPushNotificationsAsync` returns null.
 * The temporary web preview is a UI-only path; push is intentionally absent.
 */
import { Platform } from 'react-native';
import { getSupabase } from '@/lib/supabase/client';
import { APP_NAME } from '@/constants';

let Notifications: typeof import('expo-notifications') | null = null;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require('expo-notifications');
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'web' || !Notifications) return null;
  const sb = getSupabase();
  if (!sb) return null;

  let token: string | null = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: `${APP_NAME} default`,
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0F172A',
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
  const t = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
  token = t.data;

  // Persist the push token to the server in a later phase.
  // For Phase 0 we just return it for inspection.
  return token;
}
