import axios from 'axios';
import { ProviderType } from '@prisma/client';
import { OAuthCredentialPayload, OAuthProfile } from '../../../types/auth';
import { env } from '../../../config/env';
import { AppError } from '../../../utils/appError';

const GOOGLE_TOKEN_INFO_URL = 'https://oauth2.googleapis.com/tokeninfo';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

interface GoogleTokenInfoResponse {
  aud: string;
  sub: string;
  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
}

interface GoogleUserInfoResponse {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

const toDateOptional = (seconds?: number): Date | undefined => {
  if (!seconds || seconds <= 0) {
    return undefined;
  }
  return new Date(Date.now() + seconds * 1000);
};

export const verifyGoogleCredential = async (
  payload: OAuthCredentialPayload
): Promise<OAuthProfile> => {
  const { idToken, accessToken, refreshToken, expiresIn, refreshTokenExpiresIn } = payload;

  if (!idToken && !accessToken) {
    throw new AppError('Google OAuth requires an idToken or accessToken', 400);
  }

  try {
    let response: GoogleTokenInfoResponse | GoogleUserInfoResponse;

    if (idToken) {
      const { data } = await axios.get<GoogleTokenInfoResponse>(GOOGLE_TOKEN_INFO_URL, {
        params: { id_token: idToken }
      });
      response = data;
      if (env.GOOGLE_CLIENT_ID && data.aud !== env.GOOGLE_CLIENT_ID) {
        throw new AppError('Google token audience mismatch', 401);
      }
    } else {
      const { data } = await axios.get<GoogleUserInfoResponse>(GOOGLE_USERINFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      response = data;
    }

    const providerUserId = response.sub;
    if (!providerUserId) {
      throw new AppError('Google profile did not contain a user id', 502);
    }

    const profile: OAuthProfile = {
      providerType: ProviderType.GOOGLE,
      providerUserId,
      email: response.email ?? null,
      displayName: response.name ?? null,
      avatarUrl: response.picture ?? null
    };

    if (accessToken) {
      profile.accessToken = accessToken;
      const accessExpiresAt = toDateOptional(expiresIn);
      if (accessExpiresAt) {
        profile.accessTokenExpiresAt = accessExpiresAt;
      }
    }

    if (refreshToken) {
      profile.refreshToken = refreshToken;
    }
    const refreshExpiresAt = toDateOptional(refreshTokenExpiresIn);
    if (refreshExpiresAt) {
      profile.refreshTokenExpiresAt = refreshExpiresAt;
    }

    return profile;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      throw new AppError('Failed to verify Google OAuth token', status, error.response?.data);
    }
    throw error;
  }
};
