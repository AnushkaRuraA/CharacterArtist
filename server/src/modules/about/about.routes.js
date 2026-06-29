import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { uploadSingle } from '../../middleware/upload.middleware.js';
import { get, update } from './about.controller.js';

const router = Router();

router.get('/', get);
router.put('/', protect, uploadSingle('about'), update);

export default router;
