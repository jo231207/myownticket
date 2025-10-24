import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import ms, { StringValue } from 'ms';

type OptionalEnvKey =
  | 'GOOGLE_CLIENT_ID'
  | 'GOOGLE_CLIENT_SECRET'
  | 'GOOGLE_REDIRECT_URI'
  | 'KAKAO_REST_API_KEY'
  | 'KAKAO_CLIENT_SECRET'
  | 'KAKAO_REDIRECT_URI'
  | 'NAVER_CLIENT_ID'
  | 'NAVER_CLIENT_SECRET'
  | 'NAVER_REDIRECT_URI'
  | 'SUPABASE_URL'
  | 'SUPABASE_SERVICE_ROLE_KEY'
  | 'SUPABASE_ANON_KEY'
  | 'CORS_ORIGIN';

type RequiredEnvKey =
  | 'DATABASE_URL'
  | 'JWT_ACCESS_SECRET'
  | 'JWT_REFRESH_SECRET';

const ENV_PRIORITY = [
  `.env.${process.env.NODE_ENV}.local`,
  `.env.${process.env.NODE_ENV}`,
  '.env.local',
  '.env'
].filter(Boolean) as string[];

for (const file of ENV_PRIORITY) {
  const envPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  }
}

const requireEnv = (key: RequiredEnvKey): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getEnv = <K extends OptionalEnvKey>(
  key: K,
  fallback?: string
): string | undefined => {
  const value = process.env[key];
  if (!value && typeof fallback !== 'undefined') {
    return fallback;
  }
  return value;
};

const parseNumber = (key: string, fallback: number): number => {
  const raw = process.env[key];
  if (!raw) {
    return fallback;
  }
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number, received "${raw}"`);
  }
  return parsed;
};

const parseDuration = (key: string, fallback: string): number => {
  const raw = (process.env[key] ?? fallback) as StringValue;
  const value = ms(raw);
  if (typeof value !== 'number') {
    throw new Error(`Environment variable ${key} must be a valid duration (e.g. "15m"), received "${raw}"`);
  }
  return value;
};

const parseOrigins = (raw?: string): string[] | '*' => {
  if (!raw || raw.trim() === '' || raw.trim() === '*') {
    return '*';
  }
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseNumber('PORT', 4000),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES_IN_MS: parseDuration('JWT_ACCESS_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN_MS: parseDuration('JWT_REFRESH_EXPIRES_IN', '30d'),
  CORS_ORIGIN: parseOrigins(getEnv('CORS_ORIGIN')),
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  GOOGLE_REDIRECT_URI: getEnv('GOOGLE_REDIRECT_URI'),
  KAKAO_REST_API_KEY: getEnv('KAKAO_REST_API_KEY'),
  KAKAO_CLIENT_SECRET: getEnv('KAKAO_CLIENT_SECRET'),
  KAKAO_REDIRECT_URI: getEnv('KAKAO_REDIRECT_URI'),
  NAVER_CLIENT_ID: getEnv('NAVER_CLIENT_ID'),
  NAVER_CLIENT_SECRET: getEnv('NAVER_CLIENT_SECRET'),
  NAVER_REDIRECT_URI: getEnv('NAVER_REDIRECT_URI'),
  SUPABASE_URL: getEnv('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY')
};

export type AppEnvironment = typeof env;
