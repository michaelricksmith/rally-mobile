/**
 * Provider registry. Single source of truth for "which providers exist."
 * UI iterates this list; service layer routes through it.
 */
import type { WearableProviderId } from '@/types';
import type { WearableProvider } from './types';
import { PhoneProvider } from './adapters/phone';
import { AppleHealthProvider } from './adapters/apple-health';
import { HealthConnectProvider } from './adapters/health-connect';
import { GarminProvider } from './adapters/garmin';
import { FitbitProvider } from './adapters/fitbit';
import { OuraProvider } from './adapters/oura';
import { WhoopProvider } from './adapters/whoop';

const REGISTRY: Record<WearableProviderId, WearableProvider> = {
  phone: new PhoneProvider(),
  apple_health: new AppleHealthProvider(),
  apple_watch: new PhoneProvider(), // routes through Apple Health
  health_connect: new HealthConnectProvider(),
  fitbit: new FitbitProvider(),
  garmin: new GarminProvider(),
  samsung_health: new HealthConnectProvider(), // routes through Health Connect
  oura: new OuraProvider(),
  whoop: new WhoopProvider(),
  manual: new PhoneProvider(), // not a real provider; manual entry uses no SDK
};

export function getProvider(id: WearableProviderId): WearableProvider {
  const p = REGISTRY[id];
  if (!p) {
    throw new Error(`[wearables] Unknown provider: ${id}`);
  }
  return p;
}

export function listProviders(): WearableProvider[] {
  return Object.values(REGISTRY);
}
