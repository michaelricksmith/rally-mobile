import { previewPoints } from '@/services/points/ledger';
import { SCORING } from '@/constants';

describe('previewPoints', () => {
  it('returns 0 when nothing applies', () => {
    expect(
      previewPoints({
        verifiedActiveMinutes: 0,
        completed: false,
        isFirstSessionOfDay: false,
        isPersonalRecord: false,
        streakDays: 0,
        isWearableVerified: false,
      }),
    ).toBe(0);
  });

  it('applies the per-minute base weight', () => {
    const p = previewPoints({
      verifiedActiveMinutes: 30,
      completed: false,
      isFirstSessionOfDay: false,
      isPersonalRecord: false,
      streakDays: 0,
      isWearableVerified: false,
    });
    expect(p).toBe(30 * SCORING.POINTS_PER_VERIFIED_ACTIVE_MINUTE);
  });

  it('adds bonuses for completion, PR, streak, and wearable', () => {
    const p = previewPoints({
      verifiedActiveMinutes: 10,
      completed: true,
      isFirstSessionOfDay: true,
      isPersonalRecord: true,
      streakDays: 3,
      isWearableVerified: true,
    });
    expect(p).toBe(
      10 * SCORING.POINTS_PER_VERIFIED_ACTIVE_MINUTE +
        SCORING.SESSION_COMPLETION_BONUS +
        SCORING.GROUP_PARTICIPATION_BONUS +
        SCORING.PERSONAL_RECORD_BONUS +
        SCORING.STREAK_DAY_BONUS +
        SCORING.WEARABLE_VERIFICATION_BONUS,
    );
  });

  it('caps to DAILY_POINT_CAP', () => {
    const p = previewPoints({
      verifiedActiveMinutes: 10_000,
      completed: true,
      isFirstSessionOfDay: true,
      isPersonalRecord: true,
      streakDays: 365,
      isWearableVerified: true,
    });
    expect(p).toBe(SCORING.DAILY_POINT_CAP);
  });
});
