Data directory

This folder holds sample and production datasets used by the Motorcycle Trip Planner.

Subfolders:
- `pois/` - sample POI GeoJSON files
- `elevation/` - elevation tiles or CSV extracts (SRTM, etc.)
- `roads/` - optional road surface and condition features

How to use
- Local scripts in `api/src/ingest` consume files from this folder. Example: `npm run ingest:pois` runs the POI ingestion script which loads `data/pois/sample-pois.geojson` into Postgres/PostGIS.
- For production, add pipeline jobs that download and normalize authoritative sources (OSM extracts, SRTM, weather feeds) into this folder before ingestion.

Roads data

Put road geometry GeoJSON files in `data/roads/`. The sample `data/roads/sample-roads.geojson` contains two sample LineString road features with surface attributes.

Running ingestion locally:

1. Start PostGIS (from repository root):

```bash
docker compose -f infra/docker-compose.yml up -d postgres
```

2. In the `api/` folder, install dependencies and run the ingestion:

```bash
cd api
npm install
npm run ingest:roads
```

The script will read `data/roads/sample-roads.geojson`, map each feature to a `RoadSegment` entity, and insert into PostGIS.

OSM importer

You can import roads directly from OSM PBF files or GEOJSON exports.

1. To convert and import a PBF (requires `osmium` or `osmtogeojson` installed):

```bash
cd api
npm install
npm run ingest:osm -- --pbf ../../data/osm/sample.osm.pbf
```

2. To import from a pre-converted GeoJSON file:

```bash
cd api
npm install
npm run ingest:osm -- --geojson ../../data/roads/sample-osm-roads.geojson
```

Notes:
- The importer will filter for OSM 'highway' tags and convert features into `RoadSegment` records.
- For large imports, consider using `osmium`/`osmtogeojson` to chunk and pre-filter data.
