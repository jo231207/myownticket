import { AuthProvider } from '@prisma/client';
import { getSupabaseAdminClient } from '../config/supabaseAdmin';
import { OAuthProfile } from '../types/auth';
import { AppError } from '../utils/appError';

const toUnixSeconds = (date?: Date | null): number | null => {
  if (!date) {
    return null;
  }
  return Math.floor(date.getTime() / 1000);
};

export class SupabaseAccountRepository {
  async upsertFromAuthProvider(authProvider: AuthProvider, profile: OAuthProfile): Promise<void> {
    const client = getSupabaseAdminClient();
    const now = new Date().toISOString();

    const { error } = await client
      .from('tb_accounts')
      .upsert(
        {
          id: authProvider.id,
          user_id: authProvider.userId,
          provider: authProvider.provider,
          provider_account_id: authProvider.providerUserId,
          access_token: authProvider.accessToken ?? null,
          refresh_token: authProvider.refreshToken ?? null,
          expires_at: toUnixSeconds(authProvider.accessTokenExp),
          token_type: profile.tokenType ?? null,
          scope: profile.scope ?? null,
          id_token: profile.idToken ?? null,
          session_state: profile.sessionState ?? null,
          created_at: authProvider.createdAt?.toISOString() ?? now,
          updated_at: now,
          deleted_at: null
        },
        { onConflict: 'provider,provider_account_id' }
      );

    if (error) {
      throw new AppError('Failed to sync Supabase account', 502, error);
    }
  }
}

export const supabaseAccountRepository = new SupabaseAccountRepository();
