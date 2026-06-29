import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import * as ctrl from './services.controller.js';

const router = Router();

router.get('/', ctrl.getAll);
router.use(protect);
router.get('/admin', ctrl.getAllAdmin);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
