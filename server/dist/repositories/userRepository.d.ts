import { AuthProvider, ProviderType, RefreshToken, User } from '@prisma/client';
import { OAuthProfile } from '../types/auth';
export interface CreateUserInput {
    email?: string | null | undefined;
    passwordHash?: string | null | undefined;
    displayName?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}
export declare class UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByProvider(provider: ProviderType, providerUserId: string): Promise<User | null>;
    createUser(input: CreateUserInput): Promise<User>;
    upsertOAuthProvider(userId: string, profile: OAuthProfile): Promise<AuthProvider>;
    updateProfileFromOAuth(userId: string, profile: OAuthProfile): Promise<User>;
    createRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken>;
    findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null>;
    deleteRefreshToken(id: string): Promise<void>;
    revokeRefreshToken(id: string): Promise<RefreshToken>;
    revokeAllRefreshTokensForUser(userId: string): Promise<number>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=userRepository.d.ts.map