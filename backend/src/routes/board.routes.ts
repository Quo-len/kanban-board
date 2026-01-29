import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { createBoardSchema, updateBoardSchema } from '../schemas/board.schema';
import * as boardController from '../controllers/board.controller';

const router = Router();

router.post('/', validate(createBoardSchema), boardController.createBoard);

router
  .route('/:id')
  .get(boardController.getBoard)
  .put(validate(updateBoardSchema), boardController.updateBoard)
  .delete(boardController.deleteBoard);

export default router;
