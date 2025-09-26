import { Feature } from 'geojson';
import { RoadSegment } from '../entities/road-segment.entity';
import { isUnpavedSurface } from './road-utils';

export function featureToRoadSegment(feature: Feature): RoadSegment {
  const seg = new RoadSegment();
  const props: any = feature.properties || {};

  seg.geometry = feature.geometry;
  seg.surface = props.surface || props.type || undefined;
  seg.is_unpaved = isUnpavedSurface(seg.surface, props);
  seg.difficulty = props.difficulty ? Number(props.difficulty) : undefined;
  seg.metadata = { ...(props || {}) };

  return seg;
}
