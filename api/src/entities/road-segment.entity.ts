import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'road_segments' })
export class RoadSegment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // LineString geometry representing the road segment in WGS84 (4326)
  @Column({ type: 'geometry', spatialFeatureType: 'LineString', srid: 4326 })
  geometry!: any;

  // Example attributes
  @Column({ type: 'varchar', length: 100, nullable: true })
  surface?: string;

  @Column({ type: 'boolean', default: false })
  is_unpaved!: boolean;

  @Column({ type: 'int', nullable: true })
  difficulty?: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;
}
