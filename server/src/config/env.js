import dotenv from 'dotenv';
dotenv.config();

const _required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: _required('MONGODB_URI'),
  JWT_SECRET: _required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_COOKIE_EXPIRES_IN: Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@12345',
  CLOUDINARY_CLOUD_NAME: _required('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: _required('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: _required('CLOUDINARY_API_SECRET'),
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
