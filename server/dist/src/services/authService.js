"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAllSessions = exports.logout = exports.refreshSession = exports.authenticateWithOAuth = exports.loginWithEmail = exports.registerWithEmail = void 0;
const userRepository_1 = require("../repositories/userRepository");
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
const appError_1 = require("../utils/appError");
const oauthService_1 = require("./oauth/oauthService");
const sanitizeUser = (user) => {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
};
const issueTokens = async (user) => {
    const payload = {
        sub: user.id,
        email: user.email
    };
    const accessToken = (0, token_1.signAccessToken)(payload);
    const refreshSession = (0, token_1.generateRefreshSession)();
    await userRepository_1.userRepository.createRefreshToken(user.id, refreshSession.tokenHash, refreshSession.expiresAt);
    return {
        accessToken,
        refreshToken: refreshSession.token
    };
};
const registerWithEmail = async (email, password, displayName) => {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await userRepository_1.userRepository.findByEmail(normalizedEmail);
    if (existing) {
        throw new appError_1.AppError('Email is already registered', 409);
    }
    const passwordHash = await (0, password_1.hashPassword)(password);
    const user = await userRepository_1.userRepository.createUser({
        email: normalizedEmail,
        passwordHash,
        displayName
    });
    const tokens = await issueTokens(user);
    return { user: sanitizeUser(user), tokens };
};
exports.registerWithEmail = registerWithEmail;
const loginWithEmail = async (email, password) => {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository_1.userRepository.findByEmail(normalizedEmail);
    if (!user || !user.passwordHash) {
        throw new appError_1.AppError('Invalid email or password', 401);
    }
    const validPassword = await (0, password_1.verifyPassword)(password, user.passwordHash);
    if (!validPassword) {
        throw new appError_1.AppError('Invalid email or password', 401);
    }
    const tokens = await issueTokens(user);
    return { user: sanitizeUser(user), tokens };
};
exports.loginWithEmail = loginWithEmail;
const authenticateWithOAuth = async (payload) => {
    const verifiedProfile = await (0, oauthService_1.verifyOAuthCredential)(payload);
    const providerType = verifiedProfile.providerType;
    let user = await userRepository_1.userRepository.findByProvider(providerType, verifiedProfile.providerUserId);
    if (!user && verifiedProfile.email) {
        user = await userRepository_1.userRepository.findByEmail(verifiedProfile.email);
    }
    if (!user) {
        user = await userRepository_1.userRepository.createUser({
            email: verifiedProfile.email ?? null,
            passwordHash: null,
            displayName: verifiedProfile.displayName ?? null,
            avatarUrl: verifiedProfile.avatarUrl ?? null
        });
    }
    else {
        user = await userRepository_1.userRepository.updateProfileFromOAuth(user.id, verifiedProfile);
    }
    await userRepository_1.userRepository.upsertOAuthProvider(user.id, verifiedProfile);
    const tokens = await issueTokens(user);
    return { user: sanitizeUser(user), tokens };
};
exports.authenticateWithOAuth = authenticateWithOAuth;
const refreshSession = async (refreshToken) => {
    const tokenHash = (0, token_1.verifyRefreshToken)(refreshToken);
    const storedToken = await userRepository_1.userRepository.findRefreshTokenByHash(tokenHash);
    if (!storedToken) {
        throw new appError_1.AppError('Refresh token is invalid', 401);
    }
    if (storedToken.revoked) {
        throw new appError_1.AppError('Refresh token has been revoked', 401);
    }
    if (storedToken.expiresAt.getTime() < Date.now()) {
        await userRepository_1.userRepository.deleteRefreshToken(storedToken.id);
        throw new appError_1.AppError('Refresh token has expired', 401);
    }
    const user = await userRepository_1.userRepository.findById(storedToken.userId);
    if (!user) {
        await userRepository_1.userRepository.deleteRefreshToken(storedToken.id);
        throw new appError_1.AppError('User no longer exists', 404);
    }
    await userRepository_1.userRepository.deleteRefreshToken(storedToken.id);
    const tokens = await issueTokens(user);
    return { user: sanitizeUser(user), tokens };
};
exports.refreshSession = refreshSession;
const logout = async (refreshToken) => {
    const tokenHash = (0, token_1.verifyRefreshToken)(refreshToken);
    const storedToken = await userRepository_1.userRepository.findRefreshTokenByHash(tokenHash);
    if (!storedToken) {
        throw new appError_1.AppError('Refresh token is invalid', 401);
    }
    await userRepository_1.userRepository.deleteRefreshToken(storedToken.id);
};
exports.logout = logout;
const logoutAllSessions = async (userId) => {
    await userRepository_1.userRepository.revokeAllRefreshTokensForUser(userId);
};
exports.logoutAllSessions = logoutAllSessions;
//# sourceMappingURL=authService.js.map