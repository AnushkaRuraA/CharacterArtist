import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { uploadSingle } from '../../middleware/upload.middleware.js';
import { get, update } from './hero.controller.js';

const router = Router();

router.get('/', get);
router.put('/', protect, uploadSingle('hero'), update);

export default router;
