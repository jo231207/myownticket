import axios from 'axios';
import { ProviderType } from '@prisma/client';
import { OAuthCredentialPayload, OAuthProfile } from '../../../types/auth';
import { AppError } from '../../../utils/appError';

interface NaverUserResponse {
  resultcode: string;
  message: string;
  response?: {
    id?: string;
    email?: string;
    name?: string;
    nickname?: string;
    profile_image?: string;
  };
}

const toDateOptional = (seconds?: number): Date | undefined =>
  seconds && seconds > 0 ? new Date(Date.now() + seconds * 1000) : undefined;

export const verifyNaverCredential = async (
  payload: OAuthCredentialPayload
): Promise<OAuthProfile> => {
  const { accessToken, refreshToken, expiresIn, refreshTokenExpiresIn } = payload;

  if (!accessToken) {
    throw new AppError('Naver OAuth requires an accessToken', 400);
  }

  try {
    const { data } = await axios.get<NaverUserResponse>('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (data.resultcode !== '00') {
      throw new AppError('Naver OAuth token validation failed', 401, data);
    }

    const response = data.response;
    const providerUserId = response?.id;
    if (!providerUserId) {
      throw new AppError('Naver profile did not contain a user id', 502, data);
    }

    const profile: OAuthProfile = {
      providerType: ProviderType.NAVER,
      providerUserId,
      email: response?.email ?? null,
      displayName: response?.nickname ?? response?.name ?? null,
      avatarUrl: response?.profile_image ?? null
    };

    profile.accessToken = accessToken;

    const accessExpiresAt = toDateOptional(expiresIn);
    if (accessExpiresAt) {
      profile.accessTokenExpiresAt = accessExpiresAt;
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
      throw new AppError('Failed to verify Naver OAuth token', status, error.response?.data ?? error.message);
    }
    throw error;
  }
};
