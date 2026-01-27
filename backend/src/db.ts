import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbDialect =
  (process.env.DB_DIALECT as 'sqlite' | 'mysql' | 'postgres') || 'sqlite';

const storagePath =
  process.env.DB_STORAGE ||
  (process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? `${process.env.RAILWAY_VOLUME_MOUNT_PATH}/database.sqlite`
    : './database.sqlite');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'kanban_db',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: dbDialect,
    storage: dbDialect === 'sqlite' ? storagePath : undefined,
    logging: true,
  },
);

export default sequelize;
