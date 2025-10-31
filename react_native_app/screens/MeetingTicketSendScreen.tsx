import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { meetings, meetingParticipants } from '../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'MeetingTicketSend'>;

export default function MeetingTicketSendScreen({ navigation }: Props) {
  const handleParticipantSend = (
    meetingTitle: string,
    participantName: string,
    isResend: boolean
  ) => {
    const action = isResend ? '재발송' : '전송';
    Alert.alert(
      `${action} 확인`,
      `${meetingTitle} - ${participantName}님에게 ${action}합니다.`,
      [{ text: '확인' }]
    );
  };

  const handleResendAll = (meetingTitle: string) => {
    Alert.alert('입장권 전체 재발송', `${meetingTitle}의 모든 참여자에게 재발송합니다.`, [
      { text: '확인' },
    ]);
  };

  const handleResendUnsent = (meetingTitle: string) => {
    Alert.alert('미발송자 재발송', `${meetingTitle}의 미발송자에게만 재발송합니다.`, [
      { text: '확인' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>모임입장권 발송</Text>
          <Text style={styles.description}>
            모임별로 참여자에게 QR 입장권을 전송하거나 재발송할 수 있습니다.
          </Text>

          {meetings.map((meeting) => {
            const participants = meetingParticipants[meeting.id] ?? [];
            return (
              <View key={meeting.id} style={styles.meetingCard}>
                <Text style={styles.meetingTitle}>{meeting.title}</Text>
                {participants.length === 0 ? (
                  <Text style={styles.emptyText}>등록된 입장자가 없습니다.</Text>
                ) : (
                  participants.map((participant) => {
                    const isResend = Boolean(participant.sentAt);
                    return (
                      <View key={participant.id} style={styles.participantRow}>
                        <View style={styles.participantInfo}>
                          <Text style={styles.participantName}>{participant.name}</Text>
                          <Text style={styles.participantMeta}>이메일: {participant.email}</Text>
                          <Text style={styles.participantMeta}>권한: {participant.role ?? '참가자'}</Text>
                          <Text style={styles.participantMeta}>전화번호: {participant.phone}</Text>
                          <Text style={styles.participantMeta}>
                            발송일자: {participant.sentAt ?? '없음'}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.sendButton, isResend && styles.resendButton]}
                          onPress={() =>
                            handleParticipantSend(meeting.title, participant.name, isResend)
                          }
                        >
                          <Text style={[styles.sendButtonText, isResend && styles.resendButtonText]}>
                            {isResend ? '재발송' : '전송'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}

                <View style={styles.bulkButtons}>
                  <Button
                    title="입장권 전체 재발송"
                    onPress={() => handleResendAll(meeting.title)}
                  />
                  <View style={styles.bulkSpacer} />
                  <Button
                    title="미발송자 입장권 재발송"
                    onPress={() => handleResendUnsent(meeting.title)}
                  />
                </View>
              </View>
            );
          })}

          <Button title="메뉴로 돌아가기" onPress={() => navigation.goBack()} />
        </ScrollView>
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
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
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
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  participantInfo: {
    flex: 1,
    paddingRight: 12,
  },
  participantName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  participantMeta: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 2,
  },
  sendButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  resendButton: {
    backgroundColor: '#e5e7eb',
  },
  resendButtonText: {
    color: '#1f2937',
  },
  bulkButtons: {
    marginTop: 16,
  },
  bulkSpacer: {
    height: 12,
  },
});
