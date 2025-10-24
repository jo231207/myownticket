import { ProviderType } from '@prisma/client';
import { OAuthCredentialPayload, OAuthProfile, OAuthProviderSlug } from '../../types/auth';
export declare const verifyOAuthCredential: (payload: OAuthCredentialPayload) => Promise<OAuthProfile>;
export declare const providerTypeFromSlug: (slug: OAuthProviderSlug) => ProviderType;
//# sourceMappingURL=oauthService.d.ts.map