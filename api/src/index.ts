import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
declare const process: any;
import { AppDataSource } from './db/data-source';
import plansRouter from './routes/plans';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization failed', err);
    // For now continue — some dev flows may not need DB right away
  }

  const app = express();
  app.use(express.json());

  app.get('/health', (req: any, res: any) => res.json({ status: 'ok' }));
  app.use('/api/plans', plansRouter);

  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}

bootstrap();
