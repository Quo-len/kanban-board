import { z } from 'zod';

export const createCardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  columnId: z.string().uuid('Invalid column ID'),
  position: z.number().optional(),
  targetIndex: z.number().int().optional(),
});

export const updateCardSchema = createCardSchema.partial();

export const cardIdParamsSchema = z.object({
  id: z.string().uuid('Invalid card ID'),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
