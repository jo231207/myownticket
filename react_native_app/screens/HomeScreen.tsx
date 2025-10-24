import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomNav from '../components/BottomNav';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type CreatedMeeting = {
  id: string;
  title: string;
  participants: string;
  date: string;
  place: string;
};

// TODO: 실제 데이터로 대체 시 내 모임 리스트도 정렬 로직을 추가하세요.
const createdMeetings: CreatedMeeting[] = [
  { id: '1', title: '주말 등산 준비', participants: '2/10명', date: '2025-10-23', place: '서울 남산' },
  { id: '2', title: '보드게임 같이해요', participants: '2/10명', date: '2025-11-02', place: '서울 홍대' },
];

const tickets = [
  {
    id: 't1',
    event: '나이트 마켓 투어',
    date: '2025-12-01',
    place: '부산 센텀시티',
    qrData: 'https://google.com',
  },
  {
    id: 't2',
    event: '겨울 콘서트',
    date: '2025-12-10',
    place: '서울 올림픽공원',
    qrData: 'https://google.com',
  },
];

export default function HomeScreen({ navigation }: Props) {
  const [visibleQr, setVisibleQr] = useState<string | null>(null);

  const handleViewMeeting = (meeting?: CreatedMeeting) => {
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>안내</Text>
            <Text style={styles.sectionBody}>새 모임을 만들고 입장권을 한 곳에서 관리하세요.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>내 모임</Text>
            {createdMeetings.map((meeting) => (
              <View key={meeting.id} style={styles.meetingCard}>
                <Text style={styles.meetingTitle}>{meeting.title}</Text>
                <Text style={styles.meetingMeta}>참여 {meeting.participants}</Text>
                <Text style={styles.meetingMeta}>일시 {meeting.date}</Text>
                <Text style={styles.meetingMeta}>장소 {meeting.place}</Text>
                <TouchableOpacity style={styles.detailButton} onPress={() => handleViewMeeting(meeting)}>
                  <Text style={styles.detailButtonText}>모임보기</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => handleViewMeeting(createdMeetings[0])}
            >
              <Text style={styles.moreButtonText}>더보기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>내 입장권</Text>
            {tickets.map((ticket) => (
              <View key={ticket.id} style={styles.ticketCard}>
                <Text style={styles.ticketTitle}>{ticket.event}</Text>
                <Text style={styles.ticketMeta}>일시 {ticket.date}</Text>
                <Text style={styles.ticketMeta}>장소 {ticket.place}</Text>
                {/* 추후 링크로 대체, 일반 QR로 스캔시 어플리케이션 실행 후 HTTP 페이지에 참여자 정보 표시 후 입장 승인 거부 표시하게 할까?
                    아니면 그냥 단순 JWT 토큰같은걸로 표시, 차단기등에서 알아서 처리하게 해야하나? */}
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => setVisibleQr((prev) => (prev === ticket.id ? null : ticket.id))}
                >
                  <Text style={styles.qrButtonText}>
                    {visibleQr === ticket.id ? 'QR코드 숨기기' : 'QR코드 보기'}
                  </Text>
                </TouchableOpacity>
                {visibleQr === ticket.id ? (
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
            ))}
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => navigation.navigate('MyTicket')}
            >
              <Text style={styles.moreButtonText}>더보기</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionBody: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
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
