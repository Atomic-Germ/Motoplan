import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'pois' })
export class POI {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Use PostGIS geometry type for point location (SRID 4326)
  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  location!: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;
}
