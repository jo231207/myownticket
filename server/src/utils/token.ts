import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './appError';

export interface AccessTokenPayload {
  sub: string;
  email?: string | null;
}

export interface RefreshSession {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN_MS / 1000
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload & JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload & JwtPayload;
  } catch (error) {
    throw new AppError('Invalid or expired access token', 401);
  }
};

export const verifyRefreshToken = (token: string): string => {
  if (!token) {
    throw new AppError('Refresh token is required', 400);
  }
  return hashToken(token);
};

export const generateRefreshSession = (): RefreshSession => {
  const token = crypto.randomBytes(48).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN_MS);

  return { token, tokenHash, expiresAt };
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
