import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDatabase } from './config/db.js';
import { authRouter } from './routes/auth_routes.js';
import { urlRouter } from './routes/url_routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT || 4000);

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
