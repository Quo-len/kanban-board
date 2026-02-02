import { Router } from 'express';
import { validate, validateParams } from '../middlewares/validate.middleware';
import {
  createBoardSchema,
  updateBoardSchema,
  boardIdParamsSchema,
} from '../schemas/board.schema';
import * as boardController from '../controllers/board.controller';

const router = Router();

router.post('/', validate(createBoardSchema), boardController.createBoard);

router
  .route('/:id')
  .get(validateParams(boardIdParamsSchema), boardController.getBoard)
  .put(
    validateParams(boardIdParamsSchema),
    validate(updateBoardSchema),
    boardController.updateBoard,
  )
  .delete(validateParams(boardIdParamsSchema), boardController.deleteBoard);

export default router;
