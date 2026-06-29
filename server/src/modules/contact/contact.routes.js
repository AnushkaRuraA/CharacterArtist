import { Router } from 'express';
import { z } from 'zod';
import { protect } from '../../middleware/auth.middleware.js';
import { contactLimiter } from '../../middleware/rateLimit.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as ctrl from './contact.controller.js';

const contactSchema = z.object({
  name:           z.string().min(1).max(100).trim(),
  email:          z.string().email().max(200).trim(),
  subject:        z.string().max(200).trim().optional().default(''),
  message:        z.string().min(1).max(5000).trim(),
  type:           z.enum(['quick', 'project']).default('quick'),
  projectType:    z.string().max(100).trim().optional().default(''),
  budget:         z.string().max(100).trim().optional().default(''),
  deadline:       z.string().max(100).trim().optional().default(''),
  referenceLinks: z.string().max(500).trim().optional().default(''),
});

const router = Router();

router.post('/', contactLimiter, validate(contactSchema), ctrl.submit);

// Admin inbox
router.use(protect);
router.get('/messages', ctrl.getMessages);
router.patch('/messages/:id/read', ctrl.markRead);
router.delete('/messages/:id', ctrl.deleteMessage);

export default router;
