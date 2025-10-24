import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

interface BottomNavProps {
  navigation: NavigationProp<RootStackParamList>;
}

const NAV_ITEMS: Array<{ label: string; route: keyof RootStackParamList }> = [
  { label: '홈', route: 'Home' },
  { label: '새모임', route: 'MeetingCreate1' },
  { label: '모임목록', route: 'Home' },
  { label: '내 입장권', route: 'MyTicket' },
];

export default function BottomNav({ navigation }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
      ]}
    >
      {NAV_ITEMS.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.item, index === NAV_ITEMS.length - 1 && styles.lastItem]}
          onPress={() => navigation.navigate(item.route)}
        >
          <Text style={styles.itemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  item: {
    paddingHorizontal: 8,
    marginRight: 16,
  },
  lastItem: {
    marginRight: 0,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
});
