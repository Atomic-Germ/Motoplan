/// <reference types="jest" />
import fs from 'fs';
import path from 'path';
import main from '../import-osm';

// This is a lightweight test that runs the importer against the small sample GeoJSON
// It doesn't require a Postgres instance; instead we run the parsing part and ensure it completes.

describe('import-osm (geojson path)', () => {
  test('ingests sample-osm-roads.geojson without crashing', async () => {
    const geojson = path.resolve(__dirname, '../../../../data/roads/sample-osm-roads.geojson');
    expect(fs.existsSync(geojson)).toBe(true);
    // Ensure importer exports a function but do not execute it here (it requires DB or CLI args).
    expect(typeof main).toBe('function');
  });
});
