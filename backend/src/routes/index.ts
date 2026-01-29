import { Router } from 'express';
import boardRoutes from './board.routes';
import cardRoutes from './card.routes';

const router = Router();
router.use('/boards', boardRoutes);
router.use('/cards', cardRoutes);

export default router;
