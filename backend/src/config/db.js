import mongoose from 'mongoose';

const DEFAULT_DB_NAME = 'ai-loan-app';
const DEFAULT_MONGO_URI = `mongodb://127.0.0.1:27017/${DEFAULT_DB_NAME}`;

let cachedConnection = null;

export async function connectDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGO_URI;

  cachedConnection = mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || DEFAULT_DB_NAME
  });

  await cachedConnection;
  return cachedConnection;
}