import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screens/AuthScreen';
import EmailLoginScreen from './screens/EmailLoginScreen';
import EmailSignupScreen from './screens/EmailSignupScreen';
import HomeScreen from './screens/HomeScreen';
import {
  MeetingCreate1Screen,
  MeetingCreate2Screen,
  MeetingCreate3Screen,
  MeetingCreate4Screen,
  MeetingCreate5Screen,
} from './screens/MeetingCreateScreens';
import MeetingViewScreen from './screens/MeetingViewScreen';
import MeetingEditScreen from './screens/MeetingEditScreen';
import MeetingTicketSendScreen from './screens/MeetingTicketSendScreen';
import MyMeetingsScreen from './screens/MyMeetingsScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import MyTicketScreen from './screens/MyTicketScreen';
import QrScannerScreen from './screens/QrScannerScreenV2';
import SignupScreen from './screens/SignupScreen';

export type RootStackParamList = {
  Auth: undefined;
  EmailLogin: undefined;
  EmailSignup: undefined;
  MeetingCreate1:
    | {
        meetingName?: string;
        meetingDate?: string;
        headcount?: string;
        place?: string;
        description?: string;
      }
    | undefined;
  MeetingCreate2:
    | {
        meetingName: string;
        meetingDate?: string;
        headcount?: string;
        place?: string;
        description?: string;
      }
    | undefined;
  MeetingCreate3:
    | {
        meetingName: string;
        meetingDate: string;
        headcount: string;
        place?: string;
        description?: string;
      }
    | undefined;
  MeetingCreate4:
    | {
        meetingName: string;
        meetingDate: string;
        headcount: string;
        place: string;
        description?: string;
      }
    | undefined;
  MeetingCreate5:
    | {
        meetingName: string;
        meetingDate: string;
        headcount: string;
        place: string;
        description: string;
      }
    | undefined;
  MeetingView:
    | {
        meetingId: string;
        title: string;
        participants: string;
        date: string;
        place: string;
        description?: string;
      }
    | undefined;
  MeetingEdit:
    | {
        meetingId: string;
        title: string;
        participants: string;
        date: string;
        place: string;
        description?: string;
      }
    | undefined;
  MeetingTicketSend: undefined;
  MyMeetings: undefined;
  MyProfile: undefined;
  MyTicket: undefined;
  Home: undefined;
  QrScanner: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
        <Stack.Screen name="EmailSignup" component={EmailSignupScreen} />
        <Stack.Screen name="MeetingCreate1" component={MeetingCreate1Screen} />
        <Stack.Screen name="MeetingCreate2" component={MeetingCreate2Screen} />
        <Stack.Screen name="MeetingCreate3" component={MeetingCreate3Screen} />
        <Stack.Screen name="MeetingCreate4" component={MeetingCreate4Screen} />
        <Stack.Screen name="MeetingCreate5" component={MeetingCreate5Screen} />
        <Stack.Screen name="MeetingView" component={MeetingViewScreen} />
        <Stack.Screen name="MeetingEdit" component={MeetingEditScreen} />
        <Stack.Screen name="MeetingTicketSend" component={MeetingTicketSendScreen} />
        <Stack.Screen name="MyMeetings" component={MyMeetingsScreen} />
        <Stack.Screen name="MyProfile" component={MyProfileScreen} />
        <Stack.Screen name="MyTicket" component={MyTicketScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QrScanner" component={QrScannerScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


