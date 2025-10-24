import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validator';
import { AppError } from '../utils/appError';

type ErrorWithStatus = Error & { statusCode?: number; status?: number; details?: unknown };

const isValidationErrorArray = (details: unknown): details is ValidationError[] => {
  return Array.isArray(details) && details.every((item) => 'msg' in item);
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : err.statusCode ?? err.status ?? 500;
  const message = err instanceof AppError ? err.message : err.message || 'Internal server error';

  const payload: Record<string, unknown> = {
    message
  };

  if (err instanceof AppError && err.details) {
    payload.details = err.details;
  } else if (isValidationErrorArray(err.details)) {
    payload.details = err.details.map((detail) => ({
      message: detail.msg,
      field: 'param' in detail ? detail.param : undefined
    }));
  }

  res.status(statusCode).json(payload);
};
