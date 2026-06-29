import mongoose from 'mongoose';
import { env } from './env.js';

// Cache connection across serverless invocations (Vercel cold starts)
let cached = global.__mongoose || (global.__mongoose = { conn: null, promise: null });

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    }).catch((err) => {
      cached.promise = null; // allow retry on next call
      throw err;
    });
  }

  cached.conn = await cached.promise;
  console.log(`MongoDB connected: ${cached.conn.connection.host}`);
  return cached.conn;
};
