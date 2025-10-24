import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomNav from '../components/BottomNav';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'MeetingEdit'>;

export default function MeetingEditScreen({ navigation, route }: Props) {
  const meeting =
    route.params ?? {
      meetingId: '-',
      title: '선택된 모임이 없습니다.',
      participants: '-',
      date: '-',
      place: '-',
      description: '',
    };

  const [title, setTitle] = useState(meeting.title);
  const [participants, setParticipants] = useState(meeting.participants);
  const [date, setDate] = useState(meeting.date);
  const [place, setPlace] = useState(meeting.place);

  const handleSave = () => {
    const updatedMeeting = {
      ...meeting,
      title,
      participants,
      date,
      place,
    };

    Alert.alert('저장되었습니다', '변경 사항이 저장되었습니다.', [
      {
        text: '확인',
        onPress: () => navigation.navigate('MeetingView', updatedMeeting),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>모임편집</Text>
          <Text style={styles.description}>모임 정보를 간단히 수정하세요.</Text>

          <View style={styles.detailCard}>
            <Text style={styles.sectionLabel}>모임 이름</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="예: 주말 등산 준비"
              style={styles.input}
            />
            <Text style={styles.detailRow}>모임 ID: {meeting.meetingId}</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>참여 인원</Text>
              <TextInput
                value={participants}
                onChangeText={setParticipants}
                placeholder="예: 5/10명"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>일자</Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="예: 2025-10-23"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>장소</Text>
              <TextInput
                value={place}
                onChangeText={setPlace}
                placeholder="예: 서울 남산"
                style={styles.input}
              />
            </View>

            {meeting.description ? (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>요약</Text>
                <Text style={styles.summaryText}>{meeting.description}</Text>
              </View>
            ) : null}

            <Button title="변경사항 저장" onPress={handleSave} />
          </View>

          <Button title="변경사항 취소하고 돌아가기" onPress={() => navigation.goBack()} />
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
    paddingTop: 48,
    paddingBottom: 160,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    fontWeight: '600',
  },
  detailRow: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  summaryBox: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
