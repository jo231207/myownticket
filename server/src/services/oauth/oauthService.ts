import { ProviderType } from '@prisma/client';
import { env } from '../../config/env';
import { AppError } from '../../utils/appError';
import { OAuthCredentialPayload, OAuthProfile, OAuthProviderSlug, mapProviderSlugToType } from '../../types/auth';
import { verifyGoogleCredential } from './providers/googleOAuth';
import { verifyKakaoCredential } from './providers/kakaoOAuth';
import { verifyNaverCredential } from './providers/naverOAuth';
import { verifySupabaseCredential } from './providers/supabaseOAuth';

const ensureProviderConfigured = (provider: ProviderType): void => {
  switch (provider) {
    case ProviderType.GOOGLE:
      if (!env.GOOGLE_CLIENT_ID) {
        throw new AppError('Google OAuth is not configured on the server', 500);
      }
      break;
    case ProviderType.KAKAO:
      if (!env.KAKAO_REST_API_KEY) {
        throw new AppError('Kakao OAuth is not configured on the server', 500);
      }
      break;
    case ProviderType.NAVER:
      if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
        throw new AppError('Naver OAuth is not configured on the server', 500);
      }
      break;
    case ProviderType.SUPABASE:
      if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new AppError('Supabase OAuth is not configured on the server', 500);
      }
      break;
    default:
      throw new AppError(`Unsupported OAuth provider: ${provider}`, 400);
  }
};

export const verifyOAuthCredential = async (
  payload: OAuthCredentialPayload
): Promise<OAuthProfile> => {
  const providerType = mapProviderSlugToType(payload.provider);
  ensureProviderConfigured(providerType);

  switch (providerType) {
    case ProviderType.GOOGLE:
      return verifyGoogleCredential(payload);
    case ProviderType.KAKAO:
      return verifyKakaoCredential(payload);
    case ProviderType.NAVER:
      return verifyNaverCredential(payload);
    case ProviderType.SUPABASE:
      return verifySupabaseCredential(payload);
    default:
      throw new AppError(`Unsupported OAuth provider: ${payload.provider}`, 400);
  }
};

export const providerTypeFromSlug = (slug: OAuthProviderSlug): ProviderType => {
  return mapProviderSlugToType(slug);
};
