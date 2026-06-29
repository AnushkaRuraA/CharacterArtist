import { Router } from 'express';
import { login, logout, me } from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { loginLimiter } from '../../middleware/rateLimit.middleware.js';
import { loginSchema } from './auth.validation.js';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, me);

export default router;
