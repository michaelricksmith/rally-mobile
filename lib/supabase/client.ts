/**
 * Supabase client (mobile, public-only).
 * ONLY reads EXPO_PUBLIC_* env vars. Never sees the service role.
 *
 * Web fallback: expo-secure-store has no web implementation, so on web we
 * fall back to localStorage. The data is non-secret (a Supabase session
 * JWT, which is refresh-rotated and short-lived) and the user can clear
 * it from the browser at any time.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
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
 * Cross-platform storage adapter. SecureStore on native, localStorage on web.
 *
 * The web adapter is intentionally simple. It is only used when running the
 * temporary product-preview build in a browser, never for production data
 * the user relies on.
 */
const webStorageAdapter = {
  getItem: (key: string): Promise<string | null> => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return Promise.resolve();
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    if (typeof window === 'undefined') return Promise.resolve();
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const nativeSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string): Promise<void> => SecureStore.setItemAsync(key, value),
  removeItem: (key: string): Promise<void> => SecureStore.deleteItemAsync(key),
};

const storageAdapter = Platform.OS === 'web' ? webStorageAdapter : nativeSecureStoreAdapter;

let _client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> | null {
  if (_client) return _client;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  _client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: storageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // web picks up email-link callbacks from the URL
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
