import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";

interface BottomNavProps {
  navigation: NavigationProp<RootStackParamList>;
}

type NavItem = {
  key: string;
  label: string;
  icon: string;
  route: keyof RootStackParamList;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '홈', icon: '🏠', route: 'Home' },
  { key: 'create', label: '모임 만들기', icon: '➕', route: 'MeetingCreate1' },
  { key: 'view', label: '내 모임', icon: '📅', route: 'MyMeetings' },
  { key: 'tickets', label: '내 티켓', icon: '🎫', route: 'MyTicket' },
  { key: 'profile', label: '내 프로필', icon: '👤', route: 'MyProfile' },
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
      {NAV_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.item}
          onPress={() => navigation.navigate(item.route)}
        >
          <Text style={styles.itemIcon}>{item.icon}</Text>
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
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  item: {
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
  },
});
