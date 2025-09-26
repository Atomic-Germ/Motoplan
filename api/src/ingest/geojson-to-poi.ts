import { Feature } from 'geojson';
import { POI } from '../entities/poi.entity';

export function featureToPOI(feature: Feature): POI {
  const poi = new POI();
  poi.name = (feature.properties && (feature.properties as any).name) || 'Unnamed POI';
  poi.description = (feature.properties && (feature.properties as any).description) || undefined;
  poi.location = feature.geometry; // TypeORM will persist GeoJSON via geometry column when using PostGIS
  poi.metadata = { ...(feature.properties || {}) };
  return poi;
}
