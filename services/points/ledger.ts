/**
 * Point ledger adapter (read-only on the client).
 * Server is the source of truth; this module only displays transactions.
 * Mutations go through Supabase Edge Functions, never directly from the client.
 */
import { getSupabase } from '@/lib/supabase/client';
import { SCORING } from '@/constants';

export interface PointTransactionRow {
  id: string;
  user_id: string;
  group_id: string | null;
  activity_id: string | null;
  challenge_id: string | null;
  points: number;
  reason: string;
  source: string;
  verification_status: string;
  reversed_by: string | null;
  created_at: string;
}

export async function listMyPointTransactions(limit = 50): Promise<PointTransactionRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('point_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as PointTransactionRow[];
}

/** Computes a client-side preview. NEVER use for display of final point totals. */
export function previewPoints(args: {
  verifiedActiveMinutes: number;
  completed: boolean;
  isFirstSessionOfDay: boolean;
  isPersonalRecord: boolean;
  streakDays: number;
  isWearableVerified: boolean;
}): number {
  let total = 0;
  total += args.verifiedActiveMinutes * SCORING.POINTS_PER_VERIFIED_ACTIVE_MINUTE;
  if (args.completed) total += SCORING.SESSION_COMPLETION_BONUS;
  if (args.isFirstSessionOfDay) total += SCORING.GROUP_PARTICIPATION_BONUS;
  if (args.isPersonalRecord) total += SCORING.PERSONAL_RECORD_BONUS;
  if (args.streakDays > 0) total += SCORING.STREAK_DAY_BONUS;
  if (args.isWearableVerified) total += SCORING.WEARABLE_VERIFICATION_BONUS;
  return Math.min(total, SCORING.DAILY_POINT_CAP);
}
