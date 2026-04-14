import mongoose from 'mongoose';

import { ENV } from './constants.js';

let cachedConnection = null;

export async function connectDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  cachedConnection = mongoose.connect(ENV.MONGODB_URI, {
    dbName: ENV.MONGO_DB_NAME
  });

  await cachedConnection;
  return cachedConnection;
}