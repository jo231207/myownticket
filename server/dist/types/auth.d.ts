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
export declare const mapProviderSlugToType: (slug: OAuthProviderSlug) => ProviderType;
//# sourceMappingURL=auth.d.ts.map