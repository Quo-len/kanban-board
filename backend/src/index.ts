import dotenv from 'dotenv';
dotenv.config();

import sequelize from './db';
import createApp from './app';
const PORT = Number(process.env.PORT) || 4000;

const app = createApp();

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Supabase Postgres');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect:', err);
    process.exit(1);
  }
})();
