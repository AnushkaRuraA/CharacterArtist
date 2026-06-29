import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { uploadSingle } from '../../middleware/upload.middleware.js';
import * as ctrl from './testimonials.controller.js';

const router = Router();

router.get('/', ctrl.getAll);
router.use(protect);
router.post('/', uploadSingle('avatars'), ctrl.create);
router.put('/:id', uploadSingle('avatars'), ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
