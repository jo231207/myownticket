import { AuthProvider, Prisma, ProviderType, RefreshToken, User } from '@prisma/client';
import { prisma } from '../config/prisma';
import { OAuthProfile } from '../types/auth';

export interface CreateUserInput {
  email?: string | null | undefined;
  passwordHash?: string | null | undefined;
  displayName?: string | null | undefined;
  avatarUrl?: string | null | undefined;
}

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByProvider(provider: ProviderType, providerUserId: string): Promise<User | null> {
    const authProvider = await prisma.authProvider.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId
        }
      },
      include: { user: true }
    });

    return authProvider?.user ?? null;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const data: Prisma.UserCreateInput = {
      email: input.email ?? null,
      passwordHash: input.passwordHash ?? null,
      displayName: input.displayName ?? null,
      avatarUrl: input.avatarUrl ?? null
    };

    return prisma.user.create({ data });
  }

  async upsertOAuthProvider(userId: string, profile: OAuthProfile): Promise<AuthProvider> {
    const {
      providerType,
      providerUserId,
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt
    } = profile;

    return prisma.authProvider.upsert({
      where: {
        provider_providerUserId: {
          provider: providerType,
          providerUserId
        }
      },
      update: {
        userId,
        accessToken: accessToken ?? null,
        refreshToken: refreshToken ?? null,
        accessTokenExp: accessTokenExpiresAt ?? null,
        refreshTokenExp: refreshTokenExpiresAt ?? null
      },
      create: {
        userId,
        provider: providerType,
        providerUserId,
        accessToken: accessToken ?? null,
        refreshToken: refreshToken ?? null,
        accessTokenExp: accessTokenExpiresAt ?? null,
        refreshTokenExp: refreshTokenExpiresAt ?? null
      }
    });
  }

  async updateProfileFromOAuth(userId: string, profile: OAuthProfile): Promise<User> {
    const data: Prisma.UserUpdateInput = {};

    if (profile.email) {
      data.email = profile.email;
    }

    if (profile.displayName) {
      data.displayName = profile.displayName;
    }

    if (profile.avatarUrl) {
      data.avatarUrl = profile.avatarUrl;
    }

    return prisma.user.update({
      where: { id: userId },
      data
    });
  }

  async createRefreshToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt
      }
    });
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { tokenHash }
    });
  }

  async deleteRefreshToken(id: string): Promise<void> {
    await prisma.refreshToken.delete({ where: { id } });
  }

  async revokeRefreshToken(id: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({
      where: { id },
      data: { revoked: true }
    });
  }

  async revokeAllRefreshTokensForUser(userId: string): Promise<number> {
    const result = await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true }
    });
    return result.count;
  }
}

export const userRepository = new UserRepository();
