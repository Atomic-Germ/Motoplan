import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../db/data-source';
import { RoadSegment } from '../entities/road-segment.entity';
import { featureToRoadSegment } from './geojson-to-road';

const ROADS_FILE = path.resolve(__dirname, '../../../data/roads/sample-roads.geojson');

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(RoadSegment);

  const raw = fs.readFileSync(ROADS_FILE, 'utf-8');
  const geojson = JSON.parse(raw);

  if (!geojson || !Array.isArray(geojson.features)) {
    console.error('Invalid GeoJSON at', ROADS_FILE);
    process.exit(1);
  }

  const features = geojson.features;
  for (const f of features) {
    const seg = featureToRoadSegment(f as any);
    await repo.save(seg);
    console.log('Inserted road segment', seg.id, 'surface=', seg.surface, 'unpaved=', seg.is_unpaved);
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
