import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Prefer EXPO_PUBLIC_* envs. Fallback to example dev values if not provided.
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://vabpfllmqqtikwsamace.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhYnBmbGxtcXF0aWt3c2FtYWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMzMyNTAsImV4cCI6MjA3NTgwOTI1MH0.Ef3rb-pkIO9HdecEQjpT9Me_KYBY8dtsSU4MFWc5HQs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

