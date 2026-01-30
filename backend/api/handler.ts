import express, { Application, Request, Response } from 'express';
import routes from '../src/routes';
import sequelize from '../src/db';
import cors from 'cors';
import { errorHandler } from '../src/middlewares/errorHandler.middleware';
import { notFoundHandler } from '../src/middlewares/notFound.middleware';
import serverless from 'serverless-http';

const app: Application = express();

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS blocked: origin not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.use(express.json());

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.get('/status', (req: Request, res: Response) => {
  res.send('API is running');
});

app.use(notFoundHandler);

app.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Supabase Postgres on Vercel');
  } catch (err) {
    console.error('Unable to connect:', err);
  }
})();

export default serverless(app);
