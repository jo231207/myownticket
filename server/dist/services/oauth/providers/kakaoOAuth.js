"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyKakaoCredential = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const appError_1 = require("../../../utils/appError");
const toDateOptional = (seconds) => seconds && seconds > 0 ? new Date(Date.now() + seconds * 1000) : undefined;
const verifyKakaoCredential = async (payload) => {
    const { accessToken, refreshToken, expiresIn, refreshTokenExpiresIn } = payload;
    if (!accessToken) {
        throw new appError_1.AppError('Kakao OAuth requires an accessToken', 400);
    }
    try {
        const { data } = await axios_1.default.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const providerUserId = String(data.id);
        if (!providerUserId) {
            throw new appError_1.AppError('Kakao profile did not contain a user id', 502);
        }
        const account = data.kakao_account;
        const profile = account?.profile;
        const oauthProfile = {
            providerType: client_1.ProviderType.KAKAO,
            providerUserId,
            email: account?.email ?? null,
            displayName: profile?.nickname ?? null,
            avatarUrl: profile?.profile_image_url ?? profile?.thumbnail_image_url ?? null
        };
        oauthProfile.accessToken = accessToken;
        const accessExpiresAt = toDateOptional(expiresIn);
        if (accessExpiresAt) {
            oauthProfile.accessTokenExpiresAt = accessExpiresAt;
        }
        if (refreshToken) {
            oauthProfile.refreshToken = refreshToken;
        }
        const refreshExpiresAt = toDateOptional(refreshTokenExpiresIn);
        if (refreshExpiresAt) {
            oauthProfile.refreshTokenExpiresAt = refreshExpiresAt;
        }
        return oauthProfile;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const status = error.response?.status ?? 502;
            throw new appError_1.AppError('Failed to verify Kakao OAuth token', status, error.response?.data);
        }
        throw error;
    }
};
exports.verifyKakaoCredential = verifyKakaoCredential;
//# sourceMappingURL=kakaoOAuth.js.map