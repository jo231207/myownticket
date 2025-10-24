import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomNav from '../components/BottomNav';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'MeetingView'>;

type Participant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  sentAt?: string | null;
};

const participantMap: Record<string, Participant[]> = {
  '주말 등산 준비': [
    {
      id: 'p-1',
      name: '홍길동',
      email: 'hong@example.com',
      phone: '010-1111-2222',
      sentAt: null,
    },
    {
      id: 'p-2',
      name: '김영희',
      email: 'kim@example.com',
      phone: '010-3333-4444',
      sentAt: '2025-09-10 12:34',
    },
  ],
  '보드게임 같이해요': [
    {
      id: 'p-3',
      name: '이철수',
      email: 'lee@example.com',
      phone: '010-5555-6666',
      sentAt: null,
    },
    {
      id: 'p-4',
      name: '박민수',
      email: 'park@example.com',
      phone: '010-7777-8888',
      sentAt: '2025-09-11 09:00',
    },
  ],
};

export default function MeetingViewScreen({ navigation, route }: Props) {
  const meeting =
    route.params ?? {
      meetingId: '-',
      title: '선택된 모임이 없습니다.',
      participants: '-',
      date: '-',
      place: '-',
      description: '',
    };
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const participants = useMemo(
    () => participantMap[meeting.title] ?? [],
    [meeting.title]
  );

  const goToEdit = () => {
    navigation.navigate('MeetingEdit', meeting);
  };

  const handleParticipantSend = (participant: Participant) => {
    const action = participant.sentAt ? '재발송' : '전송';
    Alert.alert(
      `${action} 확인`,
      `${participant.name}님에게 ${action}합니다.`,
      [{ text: '확인' }]
    );
  };

  const handleDeleteConfirm = () => {
    setDeleteModalVisible(false);
    Alert.alert('삭제되었습니다', '모임이 삭제되었습니다.', [
      {
        text: '확인',
        onPress: () => navigation.navigate('Home'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>모임보기</Text>
          <Text style={styles.description}>생성한 모임 정보를 간단히 확인하세요.</Text>

          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{meeting.title}</Text>
            <Text style={styles.detailRow}>인원: {meeting.participants}</Text>
            <Text style={styles.detailRow}>일자: {meeting.date}</Text>
            <Text style={styles.detailRow}>장소: {meeting.place}</Text>
          </View>

          {meeting.description ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>요약</Text>
              <Text style={styles.summaryText}>{meeting.description}</Text>
              <Text style={styles.summaryNote}>상세내용추가</Text>
            </View>
          ) : (
            <Text style={styles.summaryNote}>상세내용추가</Text>
          )}

          <View style={styles.participantsSection}>
            <Text style={styles.sectionHeading}>입장자 목록</Text>
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
                      <Text style={styles.participantMeta}>전화번호: {participant.phone}</Text>
                      <Text style={styles.participantMeta}>
                        발송일자: {participant.sentAt ?? '없음'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.participantSendButton, isResend && styles.participantResend]}
                      onPress={() => handleParticipantSend(participant)}
                    >
                      <Text
                        style={[
                          styles.participantSendText,
                          isResend && styles.participantResendText,
                        ]}
                      >
                        {isResend ? '재발송' : '전송'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
            <View style={styles.shareBox}>
              <Text style={styles.shareTitle}>입장자 등록 페이지 공유하기</Text>
              <Text style={styles.shareDescription}>
                링크를 공유하면 참여자가 직접 정보를 입력하고 입장권을 받을 수 있습니다.
              </Text>
              <TouchableOpacity style={styles.shareButton} onPress={() => Alert.alert('공유', '공유 링크는 준비 중입니다.')}>
                <Text style={styles.shareButtonText}>링크 복사</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bulkActions}>
              <Button title="입장권 전체 재발송" onPress={() => Alert.alert('재발송', '모든 참여자에게 재발송합니다.')} />
              <View style={styles.bulkSpacer} />
              <Button title="미발송자 입장권 재발송" onPress={() => Alert.alert('재발송', '미발송자에게만 보냅니다.')} />
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <Button title="모임 편집하기" onPress={goToEdit} />
            <View style={styles.buttonSpacer} />
            <Button title="메인으로 돌아가기" onPress={() => navigation.navigate('Home')} />
          </View>

          <View style={styles.deleteWrapper}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setDeleteModalVisible(true)}
            >
              <Text style={styles.deleteButtonText}>모임 삭제하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal transparent visible={deleteModalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>모임 삭제하기</Text>
              <Text style={styles.modalBody}>모임 삭제시 결제금액은 환불됩니다.</Text>
              <Text style={styles.modalBody}>모임 삭제 후 복원은 불가능합니다.</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalYesButton}
                  onPress={handleDeleteConfirm}
                >
                  <Text style={styles.modalYesText}>네</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalNoButton}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Text style={styles.modalNoText}>아니오</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  detailRow: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  summaryCard: {
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
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  summaryNote: {
    marginTop: 8,
    fontSize: 13,
    color: '#9ca3af',
  },
  shareBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  shareTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  shareDescription: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 12,
  },
  shareButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  bulkActions: {
    marginTop: 16,
  },
  bulkSpacer: {
    height: 12,
  },
  participantsSection: {
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
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
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
  participantSendButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  participantSendText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  participantResend: {
    backgroundColor: '#e5e7eb',
  },
  participantResendText: {
    color: '#1f2937',
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 16,
  },
  buttonSpacer: {
    height: 12,
  },
  deleteWrapper: {
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#b91c1c',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#dc2626',
  },
  modalBody: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalYesButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fecaca',
    borderRadius: 8,
  },
  modalYesText: {
    color: '#991b1b',
    fontWeight: '700',
    fontSize: 14,
  },
  modalNoButton: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    backgroundColor: '#111827',
    borderRadius: 10,
  },
  modalNoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
