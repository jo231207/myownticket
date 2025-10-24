import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  authenticateWithOAuth,
  loginWithEmail,
  logout,
  logoutAllSessions,
  refreshSession,
  registerWithEmail
} from '../services/authService';
import { AppError } from '../utils/appError';
import { userRepository } from '../repositories/userRepository';
import { OAuthCredentialPayload } from '../types/auth';

const assertValid = (req: Request): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 422, errors.array());
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    assertValid(req);
    const { email, password, displayName } = req.body;
    const result = await registerWithEmail(email, password, displayName);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    assertValid(req);
    const { email, password } = req.body;
    const result = await loginWithEmail(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const oauth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    assertValid(req);
    const payload = req.body as OAuthCredentialPayload;
    const result = await authenticateWithOAuth(payload);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    assertValid(req);
    const { refreshToken } = req.body;
    const result = await refreshSession(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    assertValid(req);
    const { refreshToken } = req.body;
    await logout(refreshToken);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const signOutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }
    await logoutAllSessions(req.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }
    const user = await userRepository.findById(req.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const { passwordHash: _passwordHash, ...safeUser } = user;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    next(error);
  }
};
