import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
});

export const updateBoardSchema = createBoardSchema.partial();

export const boardIdParamsSchema = z.object({
  id: z.string().uuid('Invalid board ID'),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
