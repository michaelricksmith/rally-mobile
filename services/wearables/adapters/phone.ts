/**
 * PhoneProvider (stub).
 * Will read motion + approximate location via expo-sensors / expo-location
 * during a Rally session. Not implemented in Phase 0.
 */
import { NotImplementedError, type WearableProvider } from '../types';
import type { NormalizedWorkout, ProviderConnectionResult } from '@/types';

export class PhoneProvider implements WearableProvider {
  readonly id = 'phone' as const;
  readonly displayName = 'Phone';
  readonly requiresOAuth = false;

  async requestConnection(): Promise<ProviderConnectionResult> {
    return { ok: true, providerId: this.id, connectedAt: new Date().toISOString() };
  }

  listWorkouts(_since: Date): Promise<NormalizedWorkout[]> {
    throw new NotImplementedError(this.id, 'listWorkouts');
  }

  async disconnect(): Promise<void> {
    /* no-op for Phase 0 */
  }

  onWorkout(_handler: (w: NormalizedWorkout) => void): () => void {
    return () => undefined;
  }
}
