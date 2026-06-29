import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

const run = async () => {
  await mongoose.connect(env.MONGODB_URI);

  const { AdminUser } = await import('../modules/auth/auth.model.js');
  const { Settings } = await import('../modules/settings/settings.model.js');

  const exists = await AdminUser.findOne({ email: env.ADMIN_EMAIL });
  if (!exists) {
    const hashed = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
    await AdminUser.create({ email: env.ADMIN_EMAIL, password: hashed });
    console.log('Admin user created:', env.ADMIN_EMAIL);
  } else {
    console.log('Admin already exists');
  }

  const settings = await Settings.findOne();
  if (!settings) {
    await Settings.create({
      contactEmail: env.ADMIN_EMAIL,
      autoReplyBody: 'Thank you for reaching out! I will get back to you within 24-48 hours.',
      isAvailableForWork: true,
      seoTitle: 'Portfolio — Character Artist',
      seoDescription: 'Character art, 3D sculpting, and concept design.',
    });
    console.log('Default settings created');
  }

  await mongoose.disconnect();
  console.log('Seed complete');
};

run().catch((e) => { console.error(e); process.exit(1); });
