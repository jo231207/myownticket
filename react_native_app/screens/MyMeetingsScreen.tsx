import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomNav from '../components/BottomNav';
import { RootStackParamList } from '../App';
import { meetings, meetingStats } from '../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'MyMeetings'>;

export default function MyMeetingsScreen({ navigation }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleStats = (meetingId: string) => {
    setExpanded((prev) => (prev === meetingId ? null : meetingId));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>내 모임</Text>

          {meetings.map((meeting) => {
            const stats = meetingStats[meeting.id];
            const showStats = expanded === meeting.id;

            return (
              <View key={meeting.id} style={styles.meetingCard}>
                <Text style={styles.meetingTitle}>{meeting.title}</Text>
                <Text style={styles.meetingMeta}>참여 {meeting.participants}</Text>
                <Text style={styles.meetingMeta}>일시 {meeting.date}</Text>
                <Text style={styles.meetingMeta}>장소 {meeting.place}</Text>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    navigation.navigate('MeetingView', {
                      meetingId: meeting.id,
                      title: meeting.title,
                      participants: meeting.participants,
                      date: meeting.date,
                      place: meeting.place,
                    })
                  }
                >
                  <Text style={styles.actionButtonText}>모임보기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('MeetingTicketSend')}
                >
                  <Text style={styles.actionButtonText}>입장권 발송</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButtonSecondary}
                  onPress={() => toggleStats(meeting.id)}
                >
                  <Text style={styles.actionButtonSecondaryText}>
                    {showStats ? '통계 닫기' : '통계 보기'}
                  </Text>
                </TouchableOpacity>

                {showStats && stats ? (
                  <View style={styles.statsBox}>
                    <Text style={styles.statsLine}>신청 인원: {stats.requested}명</Text>
                    <Text style={styles.statsLine}>참여 인원: {stats.attended}명</Text>
                    <Text style={styles.statsLine}>총 수입: {stats.revenue}</Text>
                    <Text style={styles.statsSubheading}>일자별 참가 인원</Text>
                    {stats.byDate.map((entry) => (
                      <Text key={entry.date} style={styles.statsSubline}>
                        {entry.date}: {entry.count}명
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
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
  meetingCard: {
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
  meetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  meetingMeta: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  actionButton: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButtonSecondary: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  actionButtonSecondaryText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  statsLine: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
  },
  statsSubheading: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  statsSubline: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 2,
  },
});
