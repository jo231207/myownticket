"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerTypeFromSlug = exports.verifyOAuthCredential = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("../../config/env");
const appError_1 = require("../../utils/appError");
const auth_1 = require("../../types/auth");
const googleOAuth_1 = require("./providers/googleOAuth");
const kakaoOAuth_1 = require("./providers/kakaoOAuth");
const naverOAuth_1 = require("./providers/naverOAuth");
const supabaseOAuth_1 = require("./providers/supabaseOAuth");
const ensureProviderConfigured = (provider) => {
    switch (provider) {
        case client_1.ProviderType.GOOGLE:
            if (!env_1.env.GOOGLE_CLIENT_ID) {
                throw new appError_1.AppError('Google OAuth is not configured on the server', 500);
            }
            break;
        case client_1.ProviderType.KAKAO:
            if (!env_1.env.KAKAO_REST_API_KEY) {
                throw new appError_1.AppError('Kakao OAuth is not configured on the server', 500);
            }
            break;
        case client_1.ProviderType.NAVER:
            if (!env_1.env.NAVER_CLIENT_ID || !env_1.env.NAVER_CLIENT_SECRET) {
                throw new appError_1.AppError('Naver OAuth is not configured on the server', 500);
            }
            break;
        case client_1.ProviderType.SUPABASE:
            if (!env_1.env.SUPABASE_URL || !env_1.env.SUPABASE_SERVICE_ROLE_KEY) {
                throw new appError_1.AppError('Supabase OAuth is not configured on the server', 500);
            }
            break;
        default:
            throw new appError_1.AppError(`Unsupported OAuth provider: ${provider}`, 400);
    }
};
const verifyOAuthCredential = async (payload) => {
    const providerType = (0, auth_1.mapProviderSlugToType)(payload.provider);
    ensureProviderConfigured(providerType);
    switch (providerType) {
        case client_1.ProviderType.GOOGLE:
            return (0, googleOAuth_1.verifyGoogleCredential)(payload);
        case client_1.ProviderType.KAKAO:
            return (0, kakaoOAuth_1.verifyKakaoCredential)(payload);
        case client_1.ProviderType.NAVER:
            return (0, naverOAuth_1.verifyNaverCredential)(payload);
        case client_1.ProviderType.SUPABASE:
            return (0, supabaseOAuth_1.verifySupabaseCredential)(payload);
        default:
            throw new appError_1.AppError(`Unsupported OAuth provider: ${payload.provider}`, 400);
    }
};
exports.verifyOAuthCredential = verifyOAuthCredential;
const providerTypeFromSlug = (slug) => {
    return (0, auth_1.mapProviderSlugToType)(slug);
};
exports.providerTypeFromSlug = providerTypeFromSlug;
//# sourceMappingURL=oauthService.js.map