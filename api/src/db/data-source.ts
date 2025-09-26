import 'reflect-metadata';
import { DataSource } from 'typeorm';

declare const process: any;

const dbHost = process.env.PG_HOST || 'postgres';
const dbPort = +(process.env.PG_PORT || 5432);
const dbUser = process.env.PG_USER || 'planner';
const dbPass = process.env.PG_PASSWORD || 'planner_password';
const dbName = process.env.PG_DATABASE || 'planner_db';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPass,
  database: dbName,
  synchronize: false,
  logging: false,
  entities: [],
  migrations: []
});
