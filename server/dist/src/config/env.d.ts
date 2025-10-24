export declare const env: {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES_IN_MS: number;
    JWT_REFRESH_EXPIRES_IN_MS: number;
    CORS_ORIGIN: string[] | "*";
    GOOGLE_CLIENT_ID: string | undefined;
    GOOGLE_CLIENT_SECRET: string | undefined;
    GOOGLE_REDIRECT_URI: string | undefined;
    KAKAO_REST_API_KEY: string | undefined;
    KAKAO_CLIENT_SECRET: string | undefined;
    KAKAO_REDIRECT_URI: string | undefined;
    NAVER_CLIENT_ID: string | undefined;
    NAVER_CLIENT_SECRET: string | undefined;
    NAVER_REDIRECT_URI: string | undefined;
    SUPABASE_URL: string | undefined;
    SUPABASE_SERVICE_ROLE_KEY: string | undefined;
    SUPABASE_ANON_KEY: string | undefined;
};
export type AppEnvironment = typeof env;
//# sourceMappingURL=env.d.ts.map