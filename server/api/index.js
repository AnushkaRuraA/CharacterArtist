import 'dotenv/config';
import { connectDB } from '../src/config/db.js';
import app from '../src/app.js';

export default async (req, res) => {
  await connectDB();
  return app(req, res);
};
