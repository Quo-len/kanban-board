import { Router } from 'express';
import { validate, validateParams } from '../middlewares/validate.middleware';
import {
  createCardSchema,
  updateCardSchema,
  cardIdParamsSchema,
} from '../schemas/card.schema';
import * as cardController from '../controllers/card.controller';

const router = Router();

router.post('/', validate(createCardSchema), cardController.createCard);

router
  .route('/:id')
  .put(
    validateParams(cardIdParamsSchema),
    validate(updateCardSchema),
    cardController.updateCard,
  )
  .delete(validateParams(cardIdParamsSchema), cardController.deleteCard);

router.patch(
  '/:id/move',
  validateParams(cardIdParamsSchema),
  validate(updateCardSchema),
  cardController.moveCard,
);

export default router;
