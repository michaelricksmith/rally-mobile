import { APP_NAME, APP_SLUG, FEATURE_FLAGS, SCORING } from '@/constants';

describe('constants', () => {
  it('exposes a stable product name and slug', () => {
    expect(APP_NAME).toBe('Rally');
    expect(APP_SLUG).toBe('rally-mobile');
  });

  it('initializes every Phase 0 feature flag to false', () => {
    expect(FEATURE_FLAGS.LIVE_TRACKING).toBe(false);
    expect(FEATURE_FLAGS.DIRECT_GARMIN).toBe(false);
    expect(FEATURE_FLAGS.DIRECT_FITBIT).toBe(false);
    expect(FEATURE_FLAGS.DIRECT_OURA).toBe(false);
    expect(FEATURE_FLAGS.DIRECT_WHOOP).toBe(false);
  });

  it('exposes non-negative scoring weights', () => {
    expect(SCORING.POINTS_PER_VERIFIED_ACTIVE_MINUTE).toBeGreaterThan(0);
    expect(SCORING.DAILY_POINT_CAP).toBeGreaterThan(0);
    expect(SCORING.MAX_GROUP_MEMBERS).toBeGreaterThan(0);
  });
});
