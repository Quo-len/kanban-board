import * as boardService from '../services/board.service';
import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.middleware';

export const getBoard = asyncHandler(async (req: Request, res: Response) => {
  const board = await boardService.getBoard(req.params.id.toString());
  return res.status(200).json(board);
});

export const createBoard = asyncHandler(async (req: Request, res: Response) => {
  const board = await boardService.createBoard(req.body);
  return res.status(201).json(board);
});

export const updateBoard = asyncHandler(async (req: Request, res: Response) => {
  const board = await boardService.updateBoard(
    req.params.id.toString(),
    req.body,
  );
  return res.status(200).json(board);
});

export const deleteBoard = asyncHandler(async (req: Request, res: Response) => {
  await boardService.deleteBoard(req.params.id.toString());
  return res.status(204).send();
});
