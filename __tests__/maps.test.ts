import { activeMapProvider, appendPoint, emptyLine } from '@/services/maps';
import { MAP_PROVIDER } from '@/constants';

describe('maps service', () => {
  it('reports the active map provider from constants', () => {
    expect(activeMapProvider()).toBe(MAP_PROVIDER);
    expect(MAP_PROVIDER).toBe('react-native-maps');
  });

  it('appends points to a GeoJSON LineString', () => {
    const line = appendPoint(emptyLine(), -118.2437, 34.0522);
    expect(line.coordinates).toEqual([[-118.2437, 34.0522]]);
  });
});
