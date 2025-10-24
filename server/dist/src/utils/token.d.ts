import { JwtPayload } from 'jsonwebtoken';
export interface AccessTokenPayload {
    sub: string;
    email?: string | null;
}
export interface RefreshSession {
    token: string;
    tokenHash: string;
    expiresAt: Date;
}
export declare const signAccessToken: (payload: AccessTokenPayload) => string;
export declare const verifyAccessToken: (token: string) => AccessTokenPayload & JwtPayload;
export declare const verifyRefreshToken: (token: string) => string;
export declare const generateRefreshSession: () => RefreshSession;
export declare const hashToken: (token: string) => string;
//# sourceMappingURL=token.d.ts.map