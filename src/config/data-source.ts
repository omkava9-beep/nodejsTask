import {DataSource} from 'typeorm'
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Bid } from '../entities/Bid';

export const AppDataSource = new DataSource({
  type: 'postgres',
//   host: process.env.DB_HOST!,
//   port: Number(process.env.DB_PORT!),
//   username: process.env.DB_USER!,
//   password: process.env.DB_PASSWORD!,
//   database: process.env.DB_NAME!,
  synchronize: false, // never true in real projects — use migrations instead
  logging: process.env.NODE_ENV === 'development',
  entities: [User , Product, Bid],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: false,
  url: 'postgresql://postgres:postgres@localhost:5432/auction_db'
});