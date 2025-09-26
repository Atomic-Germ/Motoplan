#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import { pipeline } from 'stream';
import { StreamArray } from 'stream-json/streamers/StreamArray';
import { parser } from 'stream-json';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import 'reflect-metadata';
import { AppDataSource } from '../db/data-source';
import { RoadSegment } from '../entities/road-segment.entity';
import { featureToRoadSegment } from './geojson-to-road';

async function ingestGeoJSON(geojsonPath: string) {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(RoadSegment);

  return new Promise<number>((resolve, reject) => {
    const stream = fs.createReadStream(geojsonPath);
    const jsonParser = parser();
    const arr = StreamArray.withParser();
    let inserted = 0;

    pipeline(stream, jsonParser, arr, async (err: any) => {
      if (err) return reject(err);
      try {
        for (const { value } of arr) {
          // `value` is a feature
          const props: any = (value && value.properties) || {};
          // Filter to road-like features (OSM 'highway' tag)
          if (!props.highway) continue;

          const seg = featureToRoadSegment(value as any);
          await repo.save(seg);
          inserted++;
          console.log('Inserted road segment', seg.id, 'surface=', seg.surface);
        }

        await AppDataSource.destroy();
        resolve(inserted);
      } catch (e) {
        await AppDataSource.destroy();
        reject(e);
      }
    });
  });
}

function tryConvertPbfToGeoJSON(pbfPath: string, outPath: string): boolean {
  // Try osmium first
  const osmiumPath = spawnSync('which', ['osmium']);
  if (osmiumPath.status === 0) {
    console.log('Converting using osmium');
    const res = spawnSync('osmium', ['export', pbfPath, '-o', outPath]);
    return res.status === 0;
  }

  // Try osmtogeojson (node) if installed globally
  const osmtogeojsonPath = spawnSync('which', ['osmtogeojson']);
  if (osmtogeojsonPath.status === 0) {
    console.log('Converting using osmtogeojson');
    const out = fs.createWriteStream(outPath);
    const res = spawnSync('osmtogeojson', [pbfPath], { encoding: 'utf-8' });
    if (res.status === 0 && res.stdout) {
      fs.writeFileSync(outPath, res.stdout, 'utf-8');
      return true;
    }
    return false;
  }

  // Not available
  return false;
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('pbf', { type: 'string', description: 'Path to OSM PBF file' })
    .option('geojson', { type: 'string', description: 'Path to a pre-converted GeoJSON file' })
    .demandOption(['pbf', 'geojson'], 'Please provide either --pbf or --geojson')
    .help().argv as any;

  let geojsonPath = argv.geojson as string | undefined;

  if (!geojsonPath && argv.pbf) {
    // convert
    const pbfPath = path.resolve(argv.pbf);
    if (!fs.existsSync(pbfPath)) {
      console.error('PBF file not found:', pbfPath);
      process.exit(1);
    }

    const tmp = path.join(os.tmpdir(), `osm-convert-${Date.now()}.geojson`);
    const ok = tryConvertPbfToGeoJSON(pbfPath, tmp);
    if (!ok) {
      console.error('Could not convert PBF to GeoJSON: please install `osmium` or `osmtogeojson` on your PATH.');
      process.exit(1);
    }

    geojsonPath = tmp;
  }

  if (!geojsonPath) {
    console.error('No geojson file to ingest');
    process.exit(1);
  }

  if (!fs.existsSync(geojsonPath)) {
    console.error('GeoJSON file not found:', geojsonPath);
    process.exit(1);
  }

  console.log('Ingesting roads from', geojsonPath);
  const count = await ingestGeoJSON(geojsonPath);
  console.log('Inserted', count, 'road segments');
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export default main;
