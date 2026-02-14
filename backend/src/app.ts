import express, { Application, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { ForbiddenError } from './utils/errors';

const getAllowedOrigins = () => {
  const origins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL.trim());
  }

  return Array.from(new Set(origins));
};

const buildCorsOptions = (): CorsOptions => {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new ForbiddenError('CORS blocked: origin not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  };
};

const createApp = (): Application => {
  const app: Application = express();

  app.use(cors(buildCorsOptions()));
  app.use(express.json());

  app.use('/api', routes);

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Express!');
  });

  app.get('/status', (req: Request, res: Response) => {
    res.send('API is running!');
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
