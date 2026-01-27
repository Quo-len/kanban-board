import express, { Application, Request, Response } from 'express';
import sequelize from './db';
import cors from 'cors';

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

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
