/// <reference types="jest" />
import { featureToPOI } from '../geojson-to-poi';

describe('featureToPOI', () => {
  test('maps feature properties and geometry to a POI instance', () => {
    const feature: any = {
      type: 'Feature',
      properties: { name: 'Test', description: 'Desc', foo: 'bar' },
      geometry: { type: 'Point', coordinates: [1.23, 4.56] }
    };

    const poi = featureToPOI(feature);

    expect(poi).toBeDefined();
    expect(poi.name).toBe('Test');
    expect(poi.description).toBe('Desc');
    expect(poi.location).toEqual(feature.geometry);
    expect(poi.metadata).toHaveProperty('foo', 'bar');
  });
});
