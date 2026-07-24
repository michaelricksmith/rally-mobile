/**
 * AppleHealthProvider (stub).
 * Real implementation requires expo-dev-client + a native HealthKit module
 * (e.g. react-native-health or a custom config plugin). Land in Phase 4.
 */
import { NotImplementedError, type WearableProvider } from '../types';
import type { NormalizedWorkout, ProviderConnectionResult } from '@/types';

export class AppleHealthProvider implements WearableProvider {
  readonly id = 'apple_health' as const;
  readonly displayName = 'Apple Health';
  readonly requiresOAuth = false;

  async requestConnection(): Promise<ProviderConnectionResult> {
    throw new NotImplementedError(this.id, 'requestConnection');
  }

  listWorkouts(_since: Date): Promise<NormalizedWorkout[]> {
    throw new NotImplementedError(this.id, 'listWorkouts');
  }

  async disconnect(): Promise<void> {
    throw new NotImplementedError(this.id, 'disconnect');
  }

  onWorkout(_handler: (w: NormalizedWorkout) => void): () => void {
    return () => undefined;
  }
}
