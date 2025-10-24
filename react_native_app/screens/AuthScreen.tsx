import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const handleKakaoStart = () => {
    Alert.alert('카카오 로그인', '카카오 로그인은 준비 중입니다.');
  };

  const goToEmailLogin = () => navigation.navigate('EmailLogin');
  const goToEmailSignup = () => navigation.navigate('EmailSignup');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TouchableOpacity style={[styles.option, styles.kakao]} onPress={handleKakaoStart}>
        <Text style={[styles.optionText, styles.kakaoText]}>카카오로 시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={goToEmailLogin}>
        <Text style={styles.optionText}>이메일로 로그인하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={goToEmailSignup}>
        <Text style={styles.optionText}>이메일로 회원가입하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'left',
  },
  option: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#222',
  },
  kakao: {
    backgroundColor: '#FEE500',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  kakaoText: {
    color: '#191600',
  },
});
