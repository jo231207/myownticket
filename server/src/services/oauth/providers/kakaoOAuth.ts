import axios from 'axios';
import { ProviderType } from '@prisma/client';
import { OAuthCredentialPayload, OAuthProfile } from '../../../types/auth';
import { AppError } from '../../../utils/appError';

interface KakaoAccountProfile {
  nickname?: string;
  profile_image_url?: string;
  thumbnail_image_url?: string;
}

interface KakaoAccount {
  email?: string;
  profile?: KakaoAccountProfile;
  has_email?: boolean;
  email_needs_agreement?: boolean;
}

interface KakaoUserResponse {
  id: number;
  kakao_account?: KakaoAccount;
}

const toDateOptional = (seconds?: number): Date | undefined =>
  seconds && seconds > 0 ? new Date(Date.now() + seconds * 1000) : undefined;

export const verifyKakaoCredential = async (
  payload: OAuthCredentialPayload
): Promise<OAuthProfile> => {
  const { accessToken, refreshToken, expiresIn, refreshTokenExpiresIn } = payload;

  if (!accessToken) {
    throw new AppError('Kakao OAuth requires an accessToken', 400);
  }

  try {
    const { data } = await axios.get<KakaoUserResponse>('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const providerUserId = String(data.id);
    if (!providerUserId) {
      throw new AppError('Kakao profile did not contain a user id', 502);
    }

    const account = data.kakao_account;
    const profile = account?.profile;

    const oauthProfile: OAuthProfile = {
      providerType: ProviderType.KAKAO,
      providerUserId,
      email: account?.email ?? null,
      displayName: profile?.nickname ?? null,
      avatarUrl: profile?.profile_image_url ?? profile?.thumbnail_image_url ?? null
    };

    oauthProfile.accessToken = accessToken;

    const accessExpiresAt = toDateOptional(expiresIn);
    if (accessExpiresAt) {
      oauthProfile.accessTokenExpiresAt = accessExpiresAt;
    }

    if (refreshToken) {
      oauthProfile.refreshToken = refreshToken;
    }
    const refreshExpiresAt = toDateOptional(refreshTokenExpiresIn);
    if (refreshExpiresAt) {
      oauthProfile.refreshTokenExpiresAt = refreshExpiresAt;
    }

    return oauthProfile;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 502;
      throw new AppError('Failed to verify Kakao OAuth token', status, error.response?.data);
    }
    throw error;
  }
};
