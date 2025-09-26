import fs from 'fs';
import path from 'path';
import 'reflect-metadata';
import { AppDataSource } from '../db/data-source';
import { POI } from '../entities/poi.entity';
import { featureToPOI } from './geojson-to-poi';

const POIS_FILE = path.resolve(__dirname, '../../../data/pois/sample-pois.geojson');

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(POI);

  const raw = fs.readFileSync(POIS_FILE, 'utf-8');
  const geojson = JSON.parse(raw);

  if (!geojson || !Array.isArray(geojson.features)) {
    console.error('Invalid GeoJSON at', POIS_FILE);
    process.exit(1);
  }

  const features = geojson.features;
  for (const f of features) {
    const poi = featureToPOI(f as any);
    await repo.save(poi);
    console.log('Inserted POI', poi.name);
  }

  await AppDataSource.destroy();
  process.exit(0);
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export default run;
