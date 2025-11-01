import { ProviderType, User } from '@prisma/client';
import { userRepository } from '../repositories/userRepository';
import { supabaseAccountRepository } from '../repositories/supabaseAccountRepository';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  AccessTokenPayload,
  generateRefreshSession,
  signAccessToken,
  verifyRefreshToken
} from '../utils/token';
import { AppError } from '../utils/appError';
import { OAuthCredentialPayload, AuthenticatedUser } from '../types/auth';
import { verifyOAuthCredential } from './oauth/oauthService';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult {
  user: AuthenticatedUser;
  tokens: AuthTokens;
}

const sanitizeUser = (user: User): AuthenticatedUser => {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

const issueTokens = async (user: User): Promise<AuthTokens> => {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email
  };

  const accessToken = signAccessToken(payload);
  const refreshSession = generateRefreshSession();
  await userRepository.createRefreshToken(user.id, refreshSession.tokenHash, refreshSession.expiresAt);

  return {
    accessToken,
    refreshToken: refreshSession.token
  };
};

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult> => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await userRepository.findByEmail(normalizedEmail);
  if (existing) {
    throw new AppError('Email is already registered', 409);
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepository.createUser({
    email: normalizedEmail,
    passwordHash,
    displayName
  });

  const tokens = await issueTokens(user);
  return { user: sanitizeUser(user), tokens };
};

export const loginWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await userRepository.findByEmail(normalizedEmail);
  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email or password', 401);
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = await issueTokens(user);
  return { user: sanitizeUser(user), tokens };
};

export const authenticateWithOAuth = async (
  payload: OAuthCredentialPayload
): Promise<AuthResult> => {
  const verifiedProfile = await verifyOAuthCredential(payload);
  const providerType = verifiedProfile.providerType;

  let user = await userRepository.findByProvider(providerType, verifiedProfile.providerUserId);

  if (!user && verifiedProfile.email) {
    user = await userRepository.findByEmail(verifiedProfile.email);
  }

  if (!user) {
    user = await userRepository.createUser({
      email: verifiedProfile.email ?? null,
      passwordHash: null,
      displayName: verifiedProfile.displayName ?? null,
      avatarUrl: verifiedProfile.avatarUrl ?? null
    });
  } else {
    user = await userRepository.updateProfileFromOAuth(user.id, verifiedProfile);
  }

  const authProvider = await userRepository.upsertOAuthProvider(user.id, verifiedProfile);

  if (providerType === ProviderType.SUPABASE) {
    await supabaseAccountRepository.upsertFromAuthProvider(authProvider, verifiedProfile);
  }
  const tokens = await issueTokens(user);

  return { user: sanitizeUser(user), tokens };
};

export const refreshSession = async (refreshToken: string): Promise<AuthResult> => {
  const tokenHash = verifyRefreshToken(refreshToken);
  const storedToken = await userRepository.findRefreshTokenByHash(tokenHash);
  if (!storedToken) {
    throw new AppError('Refresh token is invalid', 401);
  }
  if (storedToken.revoked) {
    throw new AppError('Refresh token has been revoked', 401);
  }
  if (storedToken.expiresAt.getTime() < Date.now()) {
    await userRepository.deleteRefreshToken(storedToken.id);
    throw new AppError('Refresh token has expired', 401);
  }

  const user = await userRepository.findById(storedToken.userId);
  if (!user) {
    await userRepository.deleteRefreshToken(storedToken.id);
    throw new AppError('User no longer exists', 404);
  }

  await userRepository.deleteRefreshToken(storedToken.id);
  const tokens = await issueTokens(user);
  return { user: sanitizeUser(user), tokens };
};

export const logout = async (refreshToken: string): Promise<void> => {
  const tokenHash = verifyRefreshToken(refreshToken);
  const storedToken = await userRepository.findRefreshTokenByHash(tokenHash);
  if (!storedToken) {
    throw new AppError('Refresh token is invalid', 401);
  }
  await userRepository.deleteRefreshToken(storedToken.id);
};

export const logoutAllSessions = async (userId: string): Promise<void> => {
  await userRepository.revokeAllRefreshTokensForUser(userId);
};
