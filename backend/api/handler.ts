import sequelize from '../src/db';
import createApp from '../src/app';
import serverless from 'serverless-http';

const app = createApp();
const handler = serverless(app);

let dbReady: Promise<void> | null = null;

const ensureDbReady = async () => {
  if (!dbReady) {
    dbReady = sequelize
      .authenticate()
      .then(() => {
        console.log('Connected to Supabase Postgres on Vercel');
      })
      .catch((err) => {
        console.error('Unable to connect:', err);
        dbReady = null;
        throw err;
      });
  }

  return dbReady;
};

export default async (event: any, context: any) => {
  await ensureDbReady();
  return handler(event, context);
};
