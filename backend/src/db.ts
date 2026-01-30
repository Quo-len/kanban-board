'use strict';

import { Sequelize } from 'sequelize';
import pg from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __sequelize: Sequelize | undefined;
}

const useSsl =
  process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

let sequelize: Sequelize;

if (!(global as any).__sequelize) {
  (global as any).__sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,

    dialectOptions: {
      ssl: useSsl
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
      prepareThreshold: 0,
    },

    pool: {
      max: 1,
      min: 0,
      acquire: 30000,
      idle: 0,
      evict: 1000,
    },
  });
}

sequelize = global.__sequelize!;

export default sequelize;
