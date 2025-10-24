import { ProviderType, User } from '@prisma/client';

export type OAuthProviderSlug = 'google' | 'kakao' | 'naver' | 'supabase';

export interface OAuthCredentialPayload {
  provider: OAuthProviderSlug;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  authorizationCode?: string;
  expiresIn?: number;
  refreshTokenExpiresIn?: number;
}

export interface OAuthProfile {
  providerType: ProviderType;
  providerUserId: string;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
}

export interface AuthenticatedUser extends Omit<User, 'passwordHash'> {
  passwordHash?: never;
}

export const mapProviderSlugToType = (slug: OAuthProviderSlug): ProviderType => {
  switch (slug) {
    case 'google':
      return ProviderType.GOOGLE;
    case 'kakao':
      return ProviderType.KAKAO;
    case 'naver':
      return ProviderType.NAVER;
    case 'supabase':
      return ProviderType.SUPABASE;
    default:
      throw new Error(`Unsupported OAuth provider: ${slug as string}`);
  }
};
