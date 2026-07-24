/**
 * HealthConnectProvider (stub).
 * Real implementation requires expo-dev-client + a Health Connect module
 * (e.g. react-native-health-connect). Land in Phase 4.
 */
import { NotImplementedError, type WearableProvider } from '../types';
import type { NormalizedWorkout, ProviderConnectionResult } from '@/types';

export class HealthConnectProvider implements WearableProvider {
  readonly id = 'health_connect' as const;
  readonly displayName = 'Health Connect';
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
