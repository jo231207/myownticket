import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailLogin'>;

export default function EmailLoginScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState('md7sums@gmail.com');
  const [password, setPassword] = useState('123456789a');
  const [loading, setLoading] = useState(false);
  const [recoveryUrl, setRecoveryUrl] = useState('');

  const recentSignup = useMemo(() => route.params, [route.params]);

  const handleLogin = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const trySignIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { ok: false, error } as const;
        if (data?.user) return { ok: true } as const;
        return { ok: false, error: new Error('사용자 정보를 가져오지 못했습니다.') } as const;
      };

      const initial = await trySignIn();
      if (!initial.ok) {
        // If invalid credentials or user not found, try to sign up then sign in again
        const shouldTrySignup =
          /Invalid login credentials/i.test(initial.error?.message || '') ||
          /Email not found|User not found/i.test(initial.error?.message || '');
        if (shouldTrySignup) {
          await supabase.auth.signUp({ email, password });
          const retry = await trySignIn();
          if (!retry.ok) {
            throw (retry as any).error || initial.error;
          }
        } else if (/Email not confirmed/i.test(initial.error?.message || '')) {
          Alert.alert('이메일 미인증', '이메일 인증 후 다시 로그인해주세요.');
          return;
        } else {
          throw initial.error;
        }
      }

      navigation.navigate('Home');
    } catch (e: any) {
      Alert.alert('오류', e?.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRecoveryUrl = async () => {
    if (!recoveryUrl || !/#access_token=/.test(recoveryUrl)) {
      Alert.alert('안내', '리커버리 URL을 올바르게 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const hash = recoveryUrl.split('#')[1] || '';
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token') || '';
      const refresh_token = params.get('refresh_token') || '';
      if (!access_token || !refresh_token) {
        Alert.alert('오류', '토큰을 파싱하지 못했습니다. URL을 확인해주세요.');
        return;
      }

      const { error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
      if (setErr) {
        Alert.alert('세션 설정 실패', setErr.message);
        return;
      }

      const { error: updErr } = await supabase.auth.updateUser({ password });
      if (updErr) {
        Alert.alert('비밀번호 변경 실패', updErr.message);
        return;
      }

      Alert.alert('완료', '비밀번호가 변경되었습니다. 이제 로그인해보세요.');
    } catch (e: any) {
      Alert.alert('오류', e?.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이메일 로그인</Text>
      {recentSignup ? (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>최근 가입 정보</Text>
          {recentSignup.email ? <Text style={styles.infoText}>이메일: {recentSignup.email}</Text> : null}
          {recentSignup.name ? <Text style={styles.infoText}>이름: {recentSignup.name}</Text> : null}
          {recentSignup.phone ? <Text style={styles.infoText}>휴대전화: {recentSignup.phone}</Text> : null}
          {recentSignup.userId ? <Text style={styles.infoText}>User ID: {recentSignup.userId}</Text> : null}
        </View>
      ) : null}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호를 입력하세요"
        secureTextEntry
        style={styles.input}
      />
      <View style={{ marginTop: 8 }}>
        {loading ? <ActivityIndicator /> : <Button title="로그인하기" onPress={handleLogin} />}
      </View>

      <View style={{ marginTop: 8 }}>
        <Button
          title="바이패스 (로그인 없이 입장)"
          onPress={() => navigation.navigate('Home')}
        />
      </View>

      <View style={styles.recoveryBox}>
        <Text style={styles.recoveryTitle}>리커버리 URL 붙여넣기(임시)</Text>
        <TextInput
          value={recoveryUrl}
          onChangeText={setRecoveryUrl}
          placeholder="http://...#access_token=...&refresh_token=...&type=recovery"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button title="리커버리 URL 적용하여 비번 변경" onPress={handleApplyRecoveryUrl} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  recoveryBox: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  recoveryTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
});
