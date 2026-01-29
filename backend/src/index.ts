import express, { Application, Request, Response } from 'express';
import routes from './routes';
import sequelize from './db';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

const app: Application = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [process.env.FRONTEND_URL];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS blocked: origin not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

app.use(express.json());

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.use(notFoundHandler);

app.use(errorHandler);

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
