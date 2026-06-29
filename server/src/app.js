import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import heroRoutes from './modules/hero/hero.routes.js';
import aboutRoutes from './modules/about/about.routes.js';
import portfolioRoutes from './modules/portfolio/portfolio.routes.js';
import skillsRoutes from './modules/skills/skills.routes.js';
import servicesRoutes from './modules/services/services.routes.js';
import testimonialsRoutes from './modules/testimonials/testimonials.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import processRoutes from './modules/process/process.routes.js';

const app = express();

// Trust Vercel / reverse-proxy for correct IP in rate limiting
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = (env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser tools (curl, Postman) and same-origin
    if (!origin) return cb(null, true);
    if (env.NODE_ENV === 'development' && /^http:\/\/localhost:\d+$/.test(origin)) {
      return cb(null, true);
    }
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const v1 = '/api/v1';
app.use(`${v1}/auth`, authRoutes);
app.use(`${v1}/hero`, heroRoutes);
app.use(`${v1}/about`, aboutRoutes);
app.use(`${v1}/portfolio`, portfolioRoutes);
app.use(`${v1}/skills`, skillsRoutes);
app.use(`${v1}/services`, servicesRoutes);
app.use(`${v1}/testimonials`, testimonialsRoutes);
app.use(`${v1}/contact`, contactRoutes);
app.use(`${v1}/settings`, settingsRoutes);
app.use(`${v1}/process`, processRoutes);

app.get('/', (req, res) => res.json({ status: 'ok', message: '✅ Backend is running!' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
