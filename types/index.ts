/**
 * App-wide TypeScript types. Mirrors the SQL enums in
 * supabase/migrations/0001_init.sql. Keep in sync.
 */

export type ActivityCategory =
  | 'pickleball'
  | 'running'
  | 'walking'
  | 'basketball'
  | 'hiking'
  | 'cycling'
  | 'tennis'
  | 'golf'
  | 'general_fitness'
  | 'other';

export type WearableProviderId =
  | 'phone'
  | 'apple_health'
  | 'apple_watch'
  | 'health_connect'
  | 'fitbit'
  | 'garmin'
  | 'samsung_health'
  | 'oura'
  | 'whoop'
  | 'manual';

export type VerificationStatus =
  | 'rally_live_verified'
  | 'wearable_verified'
  | 'health_platform_imported'
  | 'phone_verified'
  | 'manually_entered'
  | 'flagged'
  | 'invalidated';

export type SessionStatus =
  | 'active'
  | 'paused'
  | 'processing'
  | 'imported'
  | 'completed'
  | 'cancelled'
  | 'flagged'
  | 'invalidated';

export type GroupRole = 'owner' | 'admin' | 'member';

export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'revoked' | 'expired';

export type SharingLevel =
  'group' | 'selected_friends' | 'no_location' | 'summary_only' | 'private';

export type PointReason =
  | 'verified_active_minute'
  | 'session_completion'
  | 'group_participation'
  | 'challenge_completion'
  | 'personal_record'
  | 'streak_bonus'
  | 'wearable_verification_bonus'
  | 'admin_adjustment'
  | 'reversal';

export type ChallengeFormat = 'individual' | 'group';

export type LeaderboardWindow = 'daily' | 'weekly' | 'monthly' | 'all_time' | 'challenge';

export type CampaignVisibility = 'public' | 'group' | 'invite_only';

export type ImportStatus =
  'pending' | 'imported' | 'duplicate_pending' | 'duplicate_resolved' | 'rejected' | 'failed';

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

export interface ProviderConnectionResult {
  ok: boolean;
  providerId: WearableProviderId;
  errorCode?: string;
  errorMessage?: string;
  connectedAt?: string;
}
