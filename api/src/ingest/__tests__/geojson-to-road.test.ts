/// <reference types="jest" />
import { featureToRoadSegment } from '../geojson-to-road';

describe('featureToRoadSegment', () => {
  test('maps surface and geometry and detects unpaved', () => {
    const feature: any = {
      type: 'Feature',
      properties: { surface: 'gravel', difficulty: 3 },
      geometry: { type: 'LineString', coordinates: [[1,2],[3,4]] }
    };

    const seg = featureToRoadSegment(feature);

    expect(seg).toBeDefined();
    expect(seg.surface).toBe('gravel');
    expect(seg.is_unpaved).toBe(true);
    expect(seg.difficulty).toBe(3);
  });

  test('defaults to paved when surface is asphalt', () => {
    const feature: any = {
      type: 'Feature',
      properties: { surface: 'asphalt' },
      geometry: { type: 'LineString', coordinates: [[1,2],[3,4]] }
    };

    const seg = featureToRoadSegment(feature);
    expect(seg.is_unpaved).toBe(false);
  });
});
