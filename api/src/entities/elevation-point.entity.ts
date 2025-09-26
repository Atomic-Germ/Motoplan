import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'elevation_points' })
export class ElevationPoint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'double precision' })
  lat!: number;

  @Column({ type: 'double precision' })
  lon!: number;

  @Column({ type: 'double precision' })
  elevation_m!: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;
}
