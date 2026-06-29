import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import * as ctrl from './skills.controller.js';

const router = Router();

router.get('/', ctrl.getAll);
router.use(protect);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.patch('/reorder', ctrl.reorder);

export default router;
