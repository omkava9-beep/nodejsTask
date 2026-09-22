import 'dotenv/config'
import {DataSource} from 'typeorm'
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Bid } from '../entities/Bid';

const DB_URL = process.env.DB_URL!;

export const AppDataSource = new DataSource({
  type: 'postgres',
  synchronize: false, // never true in real projects — use migrations instead
  logging: process.env.NODE_ENV === 'development',
  entities: [User , Product, Bid],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: false,
  url: DB_URL
});