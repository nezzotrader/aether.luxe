import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const MONGODB_URI = process.env.MONGODB_URI;

export function hasDatabaseConfig() {
  return Boolean(MONGODB_URI);
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache =
  globalForMongoose.mongooseCache ??
  (globalForMongoose.mongooseCache = { conn: null, promise: null });

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required in the environment.");
  }

  if (cache.conn) {
    return cache.conn;
  }

  cache.promise ??= mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  cache.conn = await cache.promise;
  return cache.conn;
}
