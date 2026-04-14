import cors from 'cors';
import express from 'express';

import { connectDatabase } from './config/db.js';
import { ENV } from './config/constants.js';
import { authRouter } from './routes/auth_routes.js';
import { urlRouter } from './routes/url_routes.js';
import { errorHandler } from './middlewares/errorHandler.js';


const app = express();

app.use(cors({ origin: ENV.CLIENT_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = ENV.PORT;

async function bootstrap() {
  await connectDatabase();

  app.use(authRouter);
  app.use(urlRouter);
  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`AI loan backend running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
