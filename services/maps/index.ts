/**
 * Maps service. The only place that imports react-native-maps.
 * When we move to Mapbox, this file is the swap point. Activity records
 * store geometry as a GeoJSON LineString, not as a provider-specific shape.
 */
import { MAP_PROVIDER } from '@/constants';

export function activeMapProvider(): typeof MAP_PROVIDER {
  return MAP_PROVIDER;
}

export interface GeoLine {
  type: 'LineString';
  coordinates: [number, number][]; // [lng, lat]
}

export function emptyLine(): GeoLine {
  return { type: 'LineString', coordinates: [] };
}

export function appendPoint(line: GeoLine, lng: number, lat: number): GeoLine {
  return { type: 'LineString', coordinates: [...line.coordinates, [lng, lat]] };
}
