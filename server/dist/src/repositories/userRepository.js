"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const prisma_1 = require("../config/prisma");
class UserRepository {
    async findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    async findByProvider(provider, providerUserId) {
        const authProvider = await prisma_1.prisma.authProvider.findUnique({
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
    async createUser(input) {
        const data = {
            email: input.email ?? null,
            passwordHash: input.passwordHash ?? null,
            displayName: input.displayName ?? null,
            avatarUrl: input.avatarUrl ?? null
        };
        return prisma_1.prisma.user.create({ data });
    }
    async upsertOAuthProvider(userId, profile) {
        const { providerType, providerUserId, accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = profile;
        return prisma_1.prisma.authProvider.upsert({
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
    async updateProfileFromOAuth(userId, profile) {
        const data = {};
        if (profile.email) {
            data.email = profile.email;
        }
        if (profile.displayName) {
            data.displayName = profile.displayName;
        }
        if (profile.avatarUrl) {
            data.avatarUrl = profile.avatarUrl;
        }
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data
        });
    }
    async createRefreshToken(userId, tokenHash, expiresAt) {
        return prisma_1.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt
            }
        });
    }
    async findRefreshTokenByHash(tokenHash) {
        return prisma_1.prisma.refreshToken.findUnique({
            where: { tokenHash }
        });
    }
    async deleteRefreshToken(id) {
        await prisma_1.prisma.refreshToken.delete({ where: { id } });
    }
    async revokeRefreshToken(id) {
        return prisma_1.prisma.refreshToken.update({
            where: { id },
            data: { revoked: true }
        });
    }
    async revokeAllRefreshTokensForUser(userId) {
        const result = await prisma_1.prisma.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: { revoked: true }
        });
        return result.count;
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
//# sourceMappingURL=userRepository.js.map