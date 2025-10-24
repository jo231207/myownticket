import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { verifyAccessToken } from '../utils/token';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Authorization header is missing', 401);
  }

  const token = header.substring('Bearer '.length).trim();
  if (!token) {
    throw new AppError('Access token is missing', 401);
  }

  const payload = verifyAccessToken(token);
  req.userId = payload.sub;
  next();
};
