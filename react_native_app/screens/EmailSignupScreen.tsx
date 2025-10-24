import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailSignup'>;

export default function EmailSignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState('email@example.com');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [agree, setAgree] = useState(false);

  const toggleTerms = () => setShowTerms((prev) => !prev);
  const toggleAgree = () => setAgree((prev) => !prev);

  const handleSignup = () => {
    navigation.navigate('EmailLogin');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이메일 회원가입</Text>

      <Text style={styles.label}>이메일</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>비밀번호</Text>
      <Text style={styles.helper}>영문, 숫자 포함 10자 이상 비밀번호를 입력해주세요</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호"
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>이름</Text>
      <Text style={styles.helper}>이름을 입력해주세요</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="이름"
        style={styles.input}
      />

      <Text style={styles.label}>휴대전화</Text>
      <Text style={styles.helper}>휴대전화번호를 입력해주세요</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="010-0000-0000"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.termsHeader} onPress={toggleTerms}>
        <Text style={styles.termsTitle}>회원약관</Text>
        <Text style={styles.termsChevron}>{showTerms ? '^' : 'v'}</Text>
      </TouchableOpacity>
      {showTerms && (
        <View style={styles.termsBody}>
          <Text style={styles.termsText}>
            약관 내용 예시입니다. 실제 서비스 약관을 여기에 입력하세요. 이용 목적, 개인정보 처리 방침
            등을 기재할 수 있습니다.
          </Text>
        </View>
      )}

      <Pressable style={styles.checkboxRow} onPress={toggleAgree}>
        <View style={[styles.checkbox, agree && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>회원약관에 동의합니다</Text>
      </Pressable>

      <Button title="회원가입하기" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  helper: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  termsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  termsChevron: {
    fontSize: 16,
  },
  termsBody: {
    paddingVertical: 12,
  },
  termsText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 4,
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#555',
  },
  checkboxLabel: {
    fontSize: 14,
  },
});
