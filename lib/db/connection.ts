import mongoose from 'mongoose';

export interface ConnectionStatus {
  isConnected: boolean;
  mode: 'mongodb_atlas' | 'local_store';
  databaseName?: string;
  host?: string;
  message: string;
}

interface MongooseGlobalCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseGlobalCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function getDatabaseConnection(): Promise<ConnectionStatus> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    return {
      isConnected: false,
      mode: 'local_store',
      message: 'MongoDB Atlas URI not configured or contains placeholders. Operating in local storage mode.',
    };
  }

  if (cached!.conn && mongoose.connection.readyState === 1) {
    return {
      isConnected: true,
      mode: 'mongodb_atlas',
      databaseName: mongoose.connection.name,
      host: mongoose.connection.host,
      message: `Connected to MongoDB Atlas (${mongoose.connection.host})`,
    };
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = mongoose.connect(uri, opts).then((m) => m);
  }

  try {
    cached!.conn = await cached!.promise;
    return {
      isConnected: mongoose.connection.readyState === 1,
      mode: 'mongodb_atlas',
      databaseName: mongoose.connection.name,
      host: mongoose.connection.host,
      message: `Successfully connected to MongoDB Atlas (${mongoose.connection.host})`,
    };
  } catch (err: unknown) {
    cached!.promise = null;
    cached!.conn = null;
    const errorMsg = err instanceof Error ? err.message : 'Unknown connection error';
    return {
      isConnected: false,
      mode: 'local_store',
      message: `MongoDB Atlas connection error (${errorMsg}). Falling back to local storage engine.`,
    };
  }
}
