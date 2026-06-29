import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { uploadPortfolio } from '../../middleware/upload.middleware.js';
import * as ctrl from './portfolio.controller.js';

const router = Router();

// Public routes (must come before /:slug wildcard)
router.get('/', ctrl.getAll);

// Admin routes (registered before the /:slug wildcard to avoid collision)
router.get('/admin/all', protect, ctrl.getAllAdmin);
router.post('/', protect, uploadPortfolio, ctrl.create);
router.patch('/reorder', protect, ctrl.reorder);
router.put('/:id', protect, uploadPortfolio, ctrl.update);
router.delete('/:id/image', protect, ctrl.deleteImage);
router.delete('/:id', protect, ctrl.remove);

// Public slug route (must be LAST to avoid swallowing admin routes)
router.get('/:slug', ctrl.getBySlug);

export default router;
