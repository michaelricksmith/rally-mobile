/**
 * WearableProvider: the single contract every provider adapter must satisfy.
 *
 * The rest of the app talks to this interface. The app must NEVER import
 * a provider-specific SDK directly. New providers are added by implementing
 * this interface and registering them in `./registry.ts`.
 */
import type { NormalizedWorkout, ProviderConnectionResult, WearableProviderId } from '@/types';

export interface WearableProvider {
  readonly id: WearableProviderId;
  readonly displayName: string;
  readonly requiresOAuth: boolean;
  /** Begin the connection flow. iOS / Android will pop native permission UI. */
  requestConnection(): Promise<ProviderConnectionResult>;
  /** List workouts since the given timestamp. Returns an empty array if disconnected. */
  listWorkouts(since: Date): Promise<NormalizedWorkout[]>;
  /** Stop listening and tear down any native subscriptions. */
  disconnect(): Promise<void>;
  /** Subscribe to new workouts as they arrive. Returns an unsubscribe function. */
  onWorkout(handler: (workout: NormalizedWorkout) => void): () => void;
}

export class NotImplementedError extends Error {
  constructor(provider: WearableProviderId, what: string) {
    super(`[${provider}] ${what} is not yet implemented. Phase 4/9 will land this.`);
    this.name = 'NotImplementedError';
  }
}
