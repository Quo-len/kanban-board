import * as cardService from '../services/card.service';
import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.middleware';

export const createCard = asyncHandler(async (req: Request, res: Response) => {
  const card = await cardService.createCard(req.body);
  return res.status(201).json(card);
});

export const updateCard = asyncHandler(async (req: Request, res: Response) => {
  const card = await cardService.updateCard(req.params.id.toString(), req.body);
  return res.status(200).json(card);
});

export const moveCard = asyncHandler(async (req: Request, res: Response) => {
  const card = await cardService.moveCard(req.params.id.toString(), req.body);
  return res.status(200).json(card);
});

export const deleteCard = asyncHandler(async (req: Request, res: Response) => {
  await cardService.deleteCard(req.params.id.toString());
  return res.status(204).send();
});
