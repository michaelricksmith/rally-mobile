/**
 * WhoopProvider (stub). Direct OAuth + Developer API. Land in Phase 9.
 */
import { NotImplementedError, type WearableProvider } from '../types';
import type { NormalizedWorkout, ProviderConnectionResult } from '@/types';

export class WhoopProvider implements WearableProvider {
  readonly id = 'whoop' as const;
  readonly displayName = 'WHOOP';
  readonly requiresOAuth = true;

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
