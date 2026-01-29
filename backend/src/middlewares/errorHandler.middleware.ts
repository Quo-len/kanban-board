import { Request, Response, NextFunction } from 'express';
import { AppError, InternalServerError } from '../utils/errors';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  if (!(error instanceof AppError)) {
    const message = error.message || 'Something went wrong';
    error = new InternalServerError(message);
  }

  console.error(`[${error.statusCode}] ${error.message}`, {
    url: req.originalUrl,
    method: req.method,
    stack: error.stack,
  });

  res.status(error.statusCode).json({
    success: false,
    error: {
      status: error.statusCode,
      message: error.message,
      ...(error.details && { details: error.details }),
    },
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
