import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomNav from '../components/BottomNav';
import { RootStackParamList } from '../App';
import { tickets } from '../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'MyTicket'>;

export default function MyTicketScreen({ navigation }: Props) {
  const sortedTickets = useMemo(
    () => tickets.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    []
  );
  const [visibleQr, setVisibleQr] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>내 입장권</Text>
          {sortedTickets.map((ticket) => (
            <View key={ticket.id} style={styles.ticketCard}>
              <Text style={styles.ticketText}>행사명: {ticket.event}</Text>
              <Text style={styles.ticketText}>일자: {ticket.date}</Text>
              <Text style={styles.ticketText}>장소: {ticket.place}</Text>
              <View style={styles.spacing} />
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
                    uri: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                      ticket.qrData
                    )}`,
                  }}
                  style={styles.qrImage}
                />
              ) : null}
            </View>
          ))}
          <View style={styles.footerSpacing} />
          <Button title="메인페이지로 돌아가기" onPress={() => navigation.navigate('Home')} />
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
  ticketCard: {
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 24,
  },
  ticketText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  spacing: {
    height: 12,
  },
  footerSpacing: {
    height: 24,
  },
  qrImage: {
    alignSelf: 'center',
    width: 220,
    height: 220,
    marginTop: 12,
  },
  qrButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
