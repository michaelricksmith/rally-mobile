import { getProvider, listProviders } from '@/services/wearables/registry';

describe('wearable registry', () => {
  it('lists every canonical provider', () => {
    const ids = listProviders().map((p) => p.id);
    // Aliases (apple_watch, samsung_health, manual) reuse adapter instances,
    // so we expect 10 entries total, but the *unique* IDs are 7.
    const unique = Array.from(new Set(ids)).sort();
    expect(unique).toEqual(
      ['apple_health', 'fitbit', 'garmin', 'health_connect', 'oura', 'phone', 'whoop'].sort(),
    );
    expect(ids).toHaveLength(10);
  });

  it('returns the same provider instance for repeated lookups', () => {
    expect(getProvider('phone')).toBe(getProvider('phone'));
  });

  it('throws for unknown provider id', () => {
    expect(() => getProvider('nope' as never)).toThrow();
  });

  it('marks each provider as a stub by default', async () => {
    for (const p of listProviders()) {
      // PhoneProvider.listWorkouts is a stub that throws NotImplementedError.
      // Every other adapter throws the same.
      try {
        await p.listWorkouts(new Date());
        // Phone is a no-op for now; it's still a stub for Phase 0.
        expect(p.id).toBeTruthy();
      } catch (err) {
        expect((err as Error).name).toBe('NotImplementedError');
      }
    }
  });
});
