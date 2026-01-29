import * as boardService from '../services/board.service';
import { Request, Response, NextFunction } from 'express';

export const getBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const board = await boardService.getBoard(req.params.id.toString());
    return res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const createBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const board = await boardService.createBoard(req.body);
    return res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const board = await boardService.updateBoard(
      req.params.id.toString(),
      req.body,
    );
    return res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await boardService.deleteBoard(req.params.id.toString());
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
