import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

const useSsl =
  process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(databaseUrl, {
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : undefined,
});

export default sequelize;
