import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { createCardSchema, updateCardSchema } from '../schemas/card.schema';
import * as cardController from '../controllers/card.controller';

const router = Router();

router.post('/', validate(createCardSchema), cardController.createCard);

router
  .route('/:id')
  .put(validate(updateCardSchema), cardController.updateCard)
  .delete(cardController.deleteCard);

router.patch('/:id/move', validate(updateCardSchema), cardController.moveCard);

export default router;
