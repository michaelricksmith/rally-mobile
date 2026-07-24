/**
 * Notifications service. Wraps expo-notifications and centralizes
 * permission requests, channel registration, and token storage.
 *
 * APNs / FCM credentials are NOT configured in Phase 0. Real device push
 * arrives in Phase 2 once the Expo project + EAS submission profile is set.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getSupabase } from '@/lib/supabase/client';
import { APP_NAME } from '@/constants';

export async function registerForPushNotificationsAsync(): Promise<string | null> {
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
