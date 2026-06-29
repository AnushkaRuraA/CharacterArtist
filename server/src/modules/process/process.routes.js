import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import * as ctrl from './process.controller.js';

const router = Router();

router.get('/', ctrl.getAll);

router.post('/',         protect, ctrl.create);
router.patch('/reorder', protect, ctrl.reorder);
router.put('/:id',       protect, ctrl.update);
router.delete('/:id',    protect, ctrl.remove);

export default router;
