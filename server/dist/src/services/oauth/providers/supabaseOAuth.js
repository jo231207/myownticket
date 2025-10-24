"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySupabaseCredential = void 0;
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../../../config/env");
const appError_1 = require("../../../utils/appError");
let supabaseServerClient = null;
const getSupabaseServerClient = () => {
    if (supabaseServerClient) {
        return supabaseServerClient;
    }
    if (!env_1.env.SUPABASE_URL || !env_1.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new appError_1.AppError('Supabase credentials are not configured', 500);
    }
    supabaseServerClient = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
    return supabaseServerClient;
};
const verifySupabaseCredential = async (payload) => {
    const { accessToken, refreshToken } = payload;
    if (!accessToken) {
        throw new appError_1.AppError('Supabase OAuth requires an accessToken', 400);
    }
    const client = getSupabaseServerClient();
    const { data, error } = await client.auth.getUser(accessToken);
    if (error || !data?.user) {
        throw new appError_1.AppError('Failed to verify Supabase access token', 401, error?.message ?? error);
    }
    const supabaseUser = data.user;
    const metadata = (supabaseUser.user_metadata ?? {});
    const displayName = metadata.full_name ??
        metadata.name ??
        metadata.display_name ??
        null;
    const avatarUrl = metadata.avatar_url ??
        metadata.picture ??
        null;
    const profile = {
        providerType: client_1.ProviderType.SUPABASE,
        providerUserId: supabaseUser.id,
        email: supabaseUser.email ?? null,
        displayName,
        avatarUrl,
        accessToken
    };
    if (refreshToken) {
        profile.refreshToken = refreshToken;
    }
    return profile;
};
exports.verifySupabaseCredential = verifySupabaseCredential;
//# sourceMappingURL=supabaseOAuth.js.map