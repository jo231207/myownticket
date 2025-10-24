import { OAuthCredentialPayload, AuthenticatedUser } from '../types/auth';
interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
interface AuthResult {
    user: AuthenticatedUser;
    tokens: AuthTokens;
}
export declare const registerWithEmail: (email: string, password: string, displayName?: string) => Promise<AuthResult>;
export declare const loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
export declare const authenticateWithOAuth: (payload: OAuthCredentialPayload) => Promise<AuthResult>;
export declare const refreshSession: (refreshToken: string) => Promise<AuthResult>;
export declare const logout: (refreshToken: string) => Promise<void>;
export declare const logoutAllSessions: (userId: string) => Promise<void>;
export {};
//# sourceMappingURL=authService.d.ts.map