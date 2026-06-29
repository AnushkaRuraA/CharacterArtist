import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { get, update } from './settings.controller.js';

const router = Router();

router.get('/', get);
router.put('/', protect, update);

export default router;
