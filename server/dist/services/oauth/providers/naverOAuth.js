"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyNaverCredential = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const appError_1 = require("../../../utils/appError");
const toDateOptional = (seconds) => seconds && seconds > 0 ? new Date(Date.now() + seconds * 1000) : undefined;
const verifyNaverCredential = async (payload) => {
    const { accessToken, refreshToken, expiresIn, refreshTokenExpiresIn } = payload;
    if (!accessToken) {
        throw new appError_1.AppError('Naver OAuth requires an accessToken', 400);
    }
    try {
        const { data } = await axios_1.default.get('https://openapi.naver.com/v1/nid/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (data.resultcode !== '00') {
            throw new appError_1.AppError('Naver OAuth token validation failed', 401, data);
        }
        const response = data.response;
        const providerUserId = response?.id;
        if (!providerUserId) {
            throw new appError_1.AppError('Naver profile did not contain a user id', 502, data);
        }
        const profile = {
            providerType: client_1.ProviderType.NAVER,
            providerUserId,
            email: response?.email ?? null,
            displayName: response?.nickname ?? response?.name ?? null,
            avatarUrl: response?.profile_image ?? null
        };
        profile.accessToken = accessToken;
        const accessExpiresAt = toDateOptional(expiresIn);
        if (accessExpiresAt) {
            profile.accessTokenExpiresAt = accessExpiresAt;
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
            throw new appError_1.AppError('Failed to verify Naver OAuth token', status, error.response?.data ?? error.message);
        }
        throw error;
    }
};
exports.verifyNaverCredential = verifyNaverCredential;
//# sourceMappingURL=naverOAuth.js.map