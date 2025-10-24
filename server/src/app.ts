import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/authRoutes';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';

const app = express();

const corsOptions =
  env.CORS_ORIGIN === '*'
    ? {
        origin: true,
        credentials: true
      }
    : {
        origin: env.CORS_ORIGIN,
        credentials: true
      };

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime()
  });
});

app.use('/auth', authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
