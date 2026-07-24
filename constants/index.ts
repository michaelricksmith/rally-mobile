/**
 * App-wide constants. Edit here, not by string-searching the codebase.
 * Renaming the product to anything other than "Rally" should require changes
 * only to this file (plus native bundle identifiers in app.json + EAS).
 */
export const APP_NAME = 'Rally';
export const APP_SLUG = 'rally-mobile';
export const APP_SCHEME = 'rallymobile';
export const APP_PUBLIC_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL ?? 'https://rally.app';
export const APP_INVITE_URL_PREFIX = `${APP_PUBLIC_BASE_URL}/invite/`;

/** Map provider token. MVP uses OS-native tiles; Mapbox swap is staged. */
export const MAP_PROVIDER = 'react-native-maps' as const;

/** Scoring weights. Server is the source of truth; client only displays. */
export const SCORING = {
  POINTS_PER_VERIFIED_ACTIVE_MINUTE: 1,
  SESSION_COMPLETION_BONUS: 5,
  GROUP_PARTICIPATION_BONUS: 2,
  CHALLENGE_COMPLETION_BONUS: 25,
  PERSONAL_RECORD_BONUS: 10,
  STREAK_DAY_BONUS: 3,
  WEARABLE_VERIFICATION_BONUS: 4,
  DAILY_POINT_CAP: 600,
  MAX_SESSION_LENGTH_MIN: 240,
  MAX_GROUP_MEMBERS: 50,
  MAX_PENDING_INVITES_PER_GROUP: 100,
  INVITE_CODE_LENGTH: 8,
  INVITE_TTL_HOURS: 168, // 7 days
} as const;

/** Verification levels exposed to the UI. Matches the SQL enum. */
export const VERIFICATION_LABELS: Record<string, string> = {
  rally_live_verified: 'Rally Live',
  wearable_verified: 'Wearable',
  health_platform_imported: 'Health platform',
  phone_verified: 'Phone',
  manually_entered: 'Manual',
  flagged: 'Flagged',
  invalidated: 'Invalidated',
};

/** Phase 0 feature flags. Mirrored from server config; client uses to gate UI. */
export const FEATURE_FLAGS = {
  LIVE_TRACKING: process.env.EXPO_PUBLIC_FLAG_LIVE_TRACKING === 'true',
  DIRECT_GARMIN: process.env.EXPO_PUBLIC_FLAG_DIRECT_GARMIN === 'true',
  DIRECT_FITBIT: process.env.EXPO_PUBLIC_FLAG_DIRECT_FITBIT === 'true',
  DIRECT_OURA: process.env.EXPO_PUBLIC_FLAG_DIRECT_OURA === 'true',
  DIRECT_WHOOP: process.env.EXPO_PUBLIC_FLAG_DIRECT_WHOOP === 'true',
} as const;
