import mongoose from 'mongoose';

const DATABASE_NAME = 'al-huda';
const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/al-huda';

declare global {
  var alHudaMongoosePromise: Promise<typeof mongoose> | undefined;
}

function getMongoUri() {
  const configuredUri = process.env.MONGODB_URI?.trim();
  if (configuredUri) {
    return configuredUri;
  }

  return DEFAULT_MONGODB_URI;
}

export async function connectToMongoDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!global.alHudaMongoosePromise) {
    global.alHudaMongoosePromise = mongoose.connect(getMongoUri(), {
      dbName: DATABASE_NAME,
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    return await global.alHudaMongoosePromise;
  } catch (error) {
    global.alHudaMongoosePromise = undefined;
    throw error;
  }
}

export function getMongoDatabaseName() {
  return DATABASE_NAME;
}
