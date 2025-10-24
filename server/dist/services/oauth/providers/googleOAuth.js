"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleCredential = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const env_1 = require("../../../config/env");
const appError_1 = require("../../../utils/appError");
const GOOGLE_TOKEN_INFO_URL = 'https://oauth2.googleapis.com/tokeninfo';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';
const toDateOptional = (seconds) => {
    if (!seconds || seconds <= 0) {
        return undefined;
    }
    return new Date(Date.now() + seconds * 1000);
};
const verifyGoogleCredential = async (payload) => {
    const { idToken, accessToken, refreshToken, expiresIn, refreshTokenExpiresIn } = payload;
    if (!idToken && !accessToken) {
        throw new appError_1.AppError('Google OAuth requires an idToken or accessToken', 400);
    }
    try {
        let response;
        if (idToken) {
            const { data } = await axios_1.default.get(GOOGLE_TOKEN_INFO_URL, {
                params: { id_token: idToken }
            });
            response = data;
            if (env_1.env.GOOGLE_CLIENT_ID && data.aud !== env_1.env.GOOGLE_CLIENT_ID) {
                throw new appError_1.AppError('Google token audience mismatch', 401);
            }
        }
        else {
            const { data } = await axios_1.default.get(GOOGLE_USERINFO_URL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            response = data;
        }
        const providerUserId = response.sub;
        if (!providerUserId) {
            throw new appError_1.AppError('Google profile did not contain a user id', 502);
        }
        const profile = {
            providerType: client_1.ProviderType.GOOGLE,
            providerUserId,
            email: response.email ?? null,
            displayName: response.name ?? null,
            avatarUrl: response.picture ?? null
        };
        if (accessToken) {
            profile.accessToken = accessToken;
            const accessExpiresAt = toDateOptional(expiresIn);
            if (accessExpiresAt) {
                profile.accessTokenExpiresAt = accessExpiresAt;
            }
        }
        if (refreshToken) {
            profile.refreshToken = refreshToken;
        }
        const refreshExpiresAt = toDateOptional(refreshTokenExpiresIn);
        if (refreshExpiresAt) {
            profile.refreshTokenExpiresAt = refreshExpiresAt;
        }
        return profile;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const status = error.response?.status ?? 502;
            throw new appError_1.AppError('Failed to verify Google OAuth token', status, error.response?.data);
        }
        throw error;
    }
};
exports.verifyGoogleCredential = verifyGoogleCredential;
//# sourceMappingURL=googleOAuth.js.map