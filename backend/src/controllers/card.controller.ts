import * as cardService from '../services/card.service';
import { Request, Response, NextFunction } from 'express';

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await cardService.createCard(req.body);
    return res.status(201).json(card);
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await cardService.updateCard(
      req.params.id.toString(),
      req.body,
    );
    return res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

export const moveCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await cardService.moveCard(req.params.id.toString(), req.body);
    return res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await cardService.deleteCard(req.params.id.toString());
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
