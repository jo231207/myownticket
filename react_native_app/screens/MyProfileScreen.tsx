import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BottomNav from "../components/BottomNav";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "MyProfile">;

const profile = {
  name: "김코드",
  email: "code@example.com",
  phone: "010-1234-5678",
  role: "관리자",
  organization: "MyTicket 운영팀",
};

const interests = ["이벤트 플래닝", "네트워킹", "콘서트", "체험 프로그램"];

export default function MyProfileScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>내 정보</Text>

          <View style={styles.card}>
            <Text style={styles.label}>이름</Text>
            <Text style={styles.value}>{profile.name}</Text>

            <Text style={styles.label}>이메일</Text>
            <Text style={styles.value}>{profile.email}</Text>

            <Text style={styles.label}>전화번호</Text>
            <Text style={styles.value}>{profile.phone}</Text>

            <Text style={styles.label}>역할</Text>
            <Text style={styles.value}>{profile.role}</Text>

            <Text style={styles.label}>소속</Text>
            <Text style={styles.value}>{profile.organization}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>관심분야</Text>
            {interests.map((item) => (
              <Text key={item} style={styles.listItem}>
                • {item}
              </Text>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>계정 설정</Text>
            <Text style={styles.helpText}>
              프로필 수정과 알림 설정은 곧 추가될 예정입니다. 문의 사항은 운영팀에 알려주세요.
            </Text>
          </View>
        </ScrollView>

        <BottomNav navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 160,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  helpText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 19,
  },
});
