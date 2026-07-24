/**
 * Supabase client (mobile, public-only).
 * ONLY reads EXPO_PUBLIC_* env vars. Never sees the service role.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import type { Database } from '@/types/database.generated';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // We do not throw here so that the app can still boot in placeholder mode.
  // Every caller should handle a null client and present a clear error.
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY is missing. ' +
      'Copy env.example to .env and fill in the values.',
  );
}

/**
 * Expo SecureStore adapter for Supabase Auth.
 * Persists the session across app launches on a real device.
 */
const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string): Promise<void> => SecureStore.setItemAsync(key, value),
  removeItem: (key: string): Promise<void> => SecureStore.deleteItemAsync(key),
};

let _client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> | null {
  if (_client) return _client;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  _client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // mobile doesn't use URL detection
    },
    realtime: {
      params: { eventsPerSecond: 5 },
    },
    global: {
      headers: { 'x-application-name': 'rally-mobile' },
    },
  });
  return _client;
}
