import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Step1Props = NativeStackScreenProps<RootStackParamList, 'MeetingCreate1'>;
type Step2Props = NativeStackScreenProps<RootStackParamList, 'MeetingCreate2'>;
type Step3Props = NativeStackScreenProps<RootStackParamList, 'MeetingCreate3'>;
type Step4Props = NativeStackScreenProps<RootStackParamList, 'MeetingCreate4'>;
type Step5Props = NativeStackScreenProps<RootStackParamList, 'MeetingCreate5'>;

const MAP_PLACEHOLDER_LINES = ['지도 이미지', '배달앱 스타일로 대체 예정'];

export function MeetingCreate1Screen({ navigation, route }: Step1Props) {
  const [meetingName, setMeetingName] = useState(route.params?.meetingName ?? '');

  const handleNext = () => {
    const trimmedName = meetingName.trim();
    if (!trimmedName) {
      Alert.alert('입력 필요', '모임 이름을 입력해주세요.');
      return;
    }

    navigation.navigate('MeetingCreate2', {
      meetingName: trimmedName,
      meetingDate: route.params?.meetingDate,
      headcount: route.params?.headcount,
      place: route.params?.place,
      description: route.params?.description,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <Text style={styles.stepIndicator}>1 / 5</Text>
      <Text style={styles.stepTitle}>새모임</Text>
      <Text style={styles.subtitle}>모임 이름을 입력해주세요</Text>

      <Text style={styles.label}>모임 이름</Text>
      <TextInput
        value={meetingName}
        onChangeText={setMeetingName}
        placeholder="예: 주말 등산 준비"
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Button title="다음" onPress={handleNext} />
      </View>
    </ScrollView>
  );
}

export function MeetingCreate2Screen({ navigation, route }: Step2Props) {
  const meetingName = route.params?.meetingName;
  const [meetingDate, setMeetingDate] = useState(route.params?.meetingDate ?? '');
  const [headcount, setHeadcount] = useState(route.params?.headcount ?? '');

  useEffect(() => {
    if (!meetingName) {
      navigation.replace('MeetingCreate1');
    }
  }, [meetingName, navigation]);

  if (!meetingName) {
    return null;
  }

  const handleNext = () => {
    const trimmedDate = meetingDate.trim();
    const trimmedHeadcount = headcount.trim();
    if (!trimmedDate || !trimmedHeadcount) {
      Alert.alert('입력 필요', '모임 날짜와 참여 인원을 모두 입력해주세요.');
      return;
    }

    navigation.navigate('MeetingCreate3', {
      meetingName,
      meetingDate: trimmedDate,
      headcount: trimmedHeadcount,
      place: route.params?.place,
      description: route.params?.description,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <Text style={styles.stepIndicator}>2 / 5</Text>
      <Text style={styles.stepTitle}>새모임</Text>
      <Text style={styles.subtitle}>모임을 언제 진행하시나요?</Text>

      <Text style={styles.label}>모임 날짜</Text>
      <TextInput
        value={meetingDate}
        onChangeText={setMeetingDate}
        placeholder="예: 2025-10-23"
        style={styles.input}
      />

      <Text style={styles.label}>참여 인원</Text>
      <TextInput
        value={headcount}
        onChangeText={setHeadcount}
        placeholder="예: 10명"
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Button title="다음" onPress={handleNext} />
      </View>
    </ScrollView>
  );
}

export function MeetingCreate3Screen({ navigation, route }: Step3Props) {
  const meetingName = route.params?.meetingName;
  const meetingDate = route.params?.meetingDate;
  const headcount = route.params?.headcount;
  const [place, setPlace] = useState(route.params?.place ?? '');

  useEffect(() => {
    if (!meetingName || !meetingDate || !headcount) {
      navigation.replace('MeetingCreate1');
    }
  }, [meetingName, meetingDate, headcount, navigation]);

  if (!meetingName || !meetingDate || !headcount) {
    return null;
  }

  const handleNext = () => {
    const trimmedPlace = place.trim();
    if (!trimmedPlace) {
      Alert.alert('입력 필요', '모임 장소를 입력해주세요.');
      return;
    }

    navigation.navigate('MeetingCreate4', {
      meetingName,
      meetingDate,
      headcount,
      place: trimmedPlace,
      description: route.params?.description,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <Text style={styles.stepIndicator}>3 / 5</Text>
      <Text style={styles.stepTitle}>새모임</Text>
      <Text style={styles.subtitle}>모임을 어디서 진행하시나요?</Text>

      <Text style={styles.label}>장소 검색</Text>
      <TextInput
        value={place}
        onChangeText={setPlace}
        placeholder="예: 서울 남산 팔각정"
        style={styles.input}
      />

      <View style={styles.mapPlaceholder}>
        {MAP_PLACEHOLDER_LINES.map((line) => (
          <Text key={line} style={styles.mapPlaceholderText}>
            {line}
          </Text>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <Button title="다음" onPress={handleNext} />
      </View>
    </ScrollView>
  );
}

export function MeetingCreate4Screen({ navigation, route }: Step4Props) {
  const meetingName = route.params?.meetingName;
  const meetingDate = route.params?.meetingDate;
  const headcount = route.params?.headcount;
  const place = route.params?.place;
  const [description, setDescription] = useState(route.params?.description ?? '');

  useEffect(() => {
    if (!meetingName || !meetingDate || !headcount || !place) {
      navigation.replace('MeetingCreate1');
    }
  }, [meetingName, meetingDate, headcount, place, navigation]);

  if (!meetingName || !meetingDate || !headcount || !place) {
    return null;
  }

  const handleNext = () => {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      Alert.alert('입력 필요', '모임 설명을 입력해주세요.');
      return;
    }

    navigation.navigate('MeetingCreate5', {
      meetingName,
      meetingDate,
      headcount,
      place,
      description: trimmedDescription,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <Text style={styles.stepIndicator}>4 / 5</Text>
      <Text style={styles.stepTitle}>새모임</Text>
      <Text style={styles.subtitle}>모임 설명을 입력해주세요</Text>
      <Text style={styles.notice}>해당 내용은 초대장에 공개되는 내용입니다.</Text>

      <Text style={styles.label}>모임 설명</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="예) 이태원 할로윈파티 조지웨스턴호텔점"
        style={styles.textArea}
        multiline
        numberOfLines={5}
      />

      <View style={styles.buttonRow}>
        <Button title="다음" onPress={handleNext} />
      </View>
    </ScrollView>
  );
}

export function MeetingCreate5Screen({ navigation, route }: Step5Props) {
  const data = route.params;

  const isComplete = useMemo(
    () =>
      Boolean(
        data?.meetingName &&
          data.meetingDate &&
          data.headcount &&
          data.place &&
          data.description
      ),
    [data]
  );

  useEffect(() => {
    if (!isComplete) {
      navigation.replace('MeetingCreate1');
    }
  }, [isComplete, navigation]);

  if (!isComplete || !data) {
    return null;
  }

  const goEdit = (step: keyof RootStackParamList) => {
    navigation.navigate(step, {
      meetingName: data.meetingName,
      meetingDate: data.meetingDate,
      headcount: data.headcount,
      place: data.place,
      description: data.description,
    } as any);
  };

  const handleCreate = () => {
    Alert.alert('모임이 생성되었습니다', '모임 상세 페이지로 이동합니다.', [
      {
        text: '확인',
        onPress: () =>
          navigation.navigate('MeetingView', {
            meetingId: `draft-${Date.now()}`,
            title: data.meetingName,
            participants: data.headcount,
            date: data.meetingDate,
            place: data.place,
            description: data.description,
          }),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <Text style={styles.stepIndicator}>5 / 5</Text>
      <Text style={styles.stepTitle}>모임보기</Text>
      <Text style={styles.subtitle}>입력한 내용을 확인하고 생성 버튼을 눌러주세요.</Text>

      <View style={styles.summaryCard}>
        <SummaryRow label="이름" value={data.meetingName} onEdit={() => goEdit('MeetingCreate1')} />
        <SummaryRow
          label="일자"
          value={data.meetingDate}
          onEdit={() => goEdit('MeetingCreate2')}
        />
        <SummaryRow
          label="인원"
          value={data.headcount}
          onEdit={() => goEdit('MeetingCreate2')}
        />
        <SummaryRow
          label="장소"
          value={data.place}
          onEdit={() => goEdit('MeetingCreate3')}
        />
        <SummaryRow
          label="설명"
          value={data.description}
          onEdit={() => goEdit('MeetingCreate4')}
          multiline
        />
      </View>

      <View style={styles.buttonRow}>
        <Button title="생성하기" onPress={handleCreate} />
      </View>
    </ScrollView>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
  multiline,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  multiline?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, multiline && styles.summaryRowMultiline]}>
      <View style={styles.summaryTextWrapper}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value || '-'}</Text>
      </View>
      <TouchableOpacity style={styles.editBadge} onPress={onEdit}>
        <Text style={styles.editBadgeText}>편집하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 20,
  },
  notice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    marginBottom: 24,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    minHeight: 140,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 24,
  },
  mapPlaceholder: {
    height: 200,
    borderRadius: 16,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#1d4ed8',
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonRow: {
    marginTop: 12,
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryRowMultiline: {
    alignItems: 'flex-start',
  },
  summaryTextWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 20,
  },
  editBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
  },
  editBadgeText: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '600',
  },
});
