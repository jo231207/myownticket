import { ProviderType } from '@prisma/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OAuthCredentialPayload, OAuthProfile } from '../../../types/auth';
import { env } from '../../../config/env';
import { AppError } from '../../../utils/appError';

let supabaseServerClient: SupabaseClient | null = null;

const getSupabaseServerClient = (): SupabaseClient => {
  if (supabaseServerClient) {
    return supabaseServerClient;
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError('Supabase credentials are not configured', 500);
  }
  supabaseServerClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  return supabaseServerClient;
};

const toDateOptional = (seconds?: number): Date | undefined => {
  if (!seconds || seconds <= 0) {
    return undefined;
  }
  return new Date(Date.now() + seconds * 1000);
};

export const verifySupabaseCredential = async (
  payload: OAuthCredentialPayload
): Promise<OAuthProfile> => {
  const { accessToken, refreshToken, idToken, expiresIn, refreshTokenExpiresIn } = payload;

  if (!accessToken) {
    throw new AppError('Supabase OAuth requires an accessToken', 400);
  }

  const client = getSupabaseServerClient();
  const { data, error } = await client.auth.getUser(accessToken);

  if (error || !data?.user) {
    throw new AppError('Failed to verify Supabase access token', 401, error?.message ?? error);
  }

  const supabaseUser = data.user;
  const metadata = (supabaseUser.user_metadata ?? {}) as Record<string, unknown>;

  const displayName =
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    (metadata.display_name as string | undefined) ??
    null;

  const avatarUrl =
    (metadata.avatar_url as string | undefined) ??
    (metadata.picture as string | undefined) ??
    null;

  const profile: OAuthProfile = {
    providerType: ProviderType.SUPABASE,
    providerUserId: supabaseUser.id,
    email: supabaseUser.email ?? null,
    displayName,
    avatarUrl,
    accessToken
  };

  if (refreshToken) {
    profile.refreshToken = refreshToken;
  }

  if (idToken) {
    profile.idToken = idToken;
  }

  const accessExpiresAt = toDateOptional(expiresIn);
  if (accessExpiresAt) {
    profile.accessTokenExpiresAt = accessExpiresAt;
  }

  const refreshExpiresAt = toDateOptional(refreshTokenExpiresIn);
  if (refreshExpiresAt) {
    profile.refreshTokenExpiresAt = refreshExpiresAt;
  }

  return profile;
};
