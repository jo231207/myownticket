import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomNav from '../components/BottomNav';
import { RootStackParamList } from '../App';
import { meetings, tickets } from '../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type QuickAction = {
  key: string;
  title: string;
  description: string;
  onPress: () => void;
};

export default function HomeScreen({ navigation }: Props) {
  const [visibleQr, setVisibleQr] = useState<string | null>(null);

  const limitedMeetings = meetings.slice(0, 2);
  const limitedTickets = tickets.slice(0, 2);

  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        key: 'meeting-view',
        title: '모임 보기',
        description: '모임 목록과 상세 정보를 확인해요',
        onPress: () => navigation.navigate('MyMeetings'),
      },
      {
        key: 'ticket-send',
        title: '입장권 발송',
        description: '참여자에게 QR 입장권을 빠르게 보내요',
        onPress: () => navigation.navigate('MeetingTicketSend'),
      },
      {
        key: 'qr-scan',
        title: 'QR 코드 스캔',
        description: '현장에서 바로 입장 여부를 확인해요',
        onPress: () => navigation.navigate('QrScanner'),
      },
    ],
    [navigation]
  );

  const handleViewMeeting = (meetingId?: string) => {
    const meeting = meetings.find((item) => item.id === meetingId);
    if (!meeting) return;

    navigation.navigate('MeetingView', {
      meetingId: meeting.id,
      title: meeting.title,
      participants: meeting.participants,
      date: meeting.date,
      place: meeting.place,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>홈</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.section, styles.introSection]}>
            <Text style={styles.introTitle}>환영합니다 👋</Text>
            <Text style={styles.introBody}>
              새로운 모임을 만들거나 참여자 관리를 빠르게 시작해 보세요.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>빠른 작업</Text>
            <View style={styles.quickGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.key}
                  style={styles.quickCard}
                  onPress={action.onPress}
                >
                  <Text style={styles.quickCardTitle}>{action.title}</Text>
                  <Text style={styles.quickCardDescription}>{action.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>최근 모임</Text>
            {limitedMeetings.map((meeting) => (
              <View key={meeting.id} style={styles.meetingCard}>
                <Text style={styles.meetingTitle}>{meeting.title}</Text>
                <Text style={styles.meetingMeta}>참여 인원 {meeting.participants}</Text>
                <Text style={styles.meetingMeta}>일시 {meeting.date}</Text>
                <Text style={styles.meetingMeta}>장소 {meeting.place}</Text>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => handleViewMeeting(meeting.id)}
                >
                  <Text style={styles.detailButtonText}>모임 보기</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => navigation.navigate('MyMeetings')}
            >
              <Text style={styles.moreButtonText}>모임 전체 보기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>발행된 입장권</Text>
            {limitedTickets.map((ticket) => {
              const isVisible = visibleQr === ticket.id;
              return (
                <View key={ticket.id} style={styles.ticketCard}>
                  <Text style={styles.ticketTitle}>{ticket.event}</Text>
                  <Text style={styles.ticketMeta}>일시 {ticket.date}</Text>
                  <Text style={styles.ticketMeta}>장소 {ticket.place}</Text>
                  <TouchableOpacity
                    style={styles.qrButton}
                    onPress={() => setVisibleQr((prev) => (prev === ticket.id ? null : ticket.id))}
                  >
                    <Text style={styles.qrButtonText}>
                      {isVisible ? 'QR 코드 닫기' : 'QR 코드 열기'}
                    </Text>
                  </TouchableOpacity>
                  {isVisible ? (
                    <Image
                      source={{
                        uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          ticket.qrData
                        )}`,
                      }}
                      style={styles.qrImage}
                    />
                  ) : null}
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => navigation.navigate('MyTicket')}
            >
              <Text style={styles.moreButtonText}>입장권 전체 보기</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 160,
  },
  section: {
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
  introSection: {
    backgroundColor: '#111827',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 10,
  },
  introBody: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  quickCardDescription: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  meetingCard: {
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  meetingMeta: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  detailButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  ticketCard: {
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  ticketMeta: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  qrImage: {
    marginTop: 12,
    width: 160,
    height: 160,
    alignSelf: 'flex-start',
  },
  qrButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  moreButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  moreButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
});
