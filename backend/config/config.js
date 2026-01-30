'use strict';

require('dotenv').config();

const useSsl =
  process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

const baseConfig = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : undefined,
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};
