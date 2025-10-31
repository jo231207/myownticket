export type MeetingSummary = {
  id: string;
  title: string;
  participants: string;
  date: string;
  place: string;
};

export type TicketSummary = {
  id: string;
  event: string;
  date: string;
  place: string;
  qrData: string;
};

export type Participant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  sentAt?: string | null;
  role?: '참가자' | '검증자' | '관리자';
};

export type MeetingStats = {
  requested: number;
  attended: number;
  byDate: Array<{ date: string; count: number }>;
  revenue: string;
};

export const meetings: MeetingSummary[] = [
  {
    id: 'meeting-1',
    title: '주말 등산 준비',
    participants: '2/10명',
    date: '2025-10-23',
    place: '서울 남산',
  },
  {
    id: 'meeting-2',
    title: '보드게임 같이해요',
    participants: '5/12명',
    date: '2025-11-02',
    place: '서울 홍대',
  },
  {
    id: 'meeting-3',
    title: '디지털 노마드 네트워킹',
    participants: '12/20명',
    date: '2025-11-15',
    place: '부산 센텀시티',
  },
  {
    id: 'meeting-4',
    title: '겨울 콘서트 준비 모임',
    participants: '8/15명',
    date: '2025-12-05',
    place: '서울 올림픽공원',
  },
];

export const tickets: TicketSummary[] = [
  {
    id: 'ticket-1',
    event: '나이트 마켓 탐방',
    date: '2025-12-01',
    place: '부산 센텀시티',
    qrData: 'https://google.com',
  },
  {
    id: 'ticket-2',
    event: '겨울 콘서트',
    date: '2025-12-10',
    place: '서울 올림픽공원',
    qrData: 'https://google.com',
  },
  {
    id: 'ticket-3',
    event: '디지털 노마드 네트워킹',
    date: '2025-11-15',
    place: '부산 창업카페',
    qrData: 'https://google.com',
  },
];

export const meetingParticipants: Record<string, Participant[]> = {
  'meeting-1': [
    {
      id: 'meeting-1-p-1',
      name: '홍길동',
      email: 'hong@example.com',
      phone: '010-1111-2222',
      sentAt: null,
      role: '참가자',
    },
    {
      id: 'meeting-1-p-2',
      name: '김영희',
      email: 'kim@example.com',
      phone: '010-3333-4444',
      sentAt: '2025-09-10 12:34',
      role: '검증자',
    },
  ],
  'meeting-2': [
    {
      id: 'meeting-2-p-1',
      name: '이철수',
      email: 'lee@example.com',
      phone: '010-5555-6666',
      sentAt: null,
      role: '참가자',
    },
    {
      id: 'meeting-2-p-2',
      name: '박민수',
      email: 'park@example.com',
      phone: '010-7777-8888',
      sentAt: '2025-09-11 09:00',
      role: '관리자',
    },
  ],
  'meeting-3': [],
  'meeting-4': [],
};

export const meetingStats: Record<string, MeetingStats> = {
  'meeting-1': {
    requested: 10,
    attended: 2,
    byDate: [
      { date: '2025-09-01', count: 1 },
      { date: '2025-09-05', count: 1 },
    ],
    revenue: '₩120,000',
  },
  'meeting-2': {
    requested: 20,
    attended: 12,
    byDate: [
      { date: '2025-10-10', count: 5 },
      { date: '2025-10-18', count: 7 },
    ],
    revenue: '₩360,000',
  },
  'meeting-3': {
    requested: 40,
    attended: 25,
    byDate: [
      { date: '2025-10-01', count: 12 },
      { date: '2025-10-20', count: 13 },
    ],
    revenue: '₩800,000',
  },
  'meeting-4': {
    requested: 18,
    attended: 8,
    byDate: [
      { date: '2025-11-01', count: 4 },
      { date: '2025-11-12', count: 4 },
    ],
    revenue: '₩240,000',
  },
};
