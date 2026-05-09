import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Text, View } from '@/components/Themed';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';

type LoginMethod = 'phone' | 'email';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuthenticated, setGuest } = useAuthStore();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = useMemo(() => {
    if (!password.trim()) return false;
    return loginMethod === 'email' ? /.+@.+\..+/.test(email.trim()) : phone.trim().length >= 8;
  }, [email, phone, password, loginMethod]);

  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert('Missing details', 'Please enter valid credentials to continue.');
      return;
    }

    try {
      setIsLoading(true);
      const credentials =
        loginMethod === 'email'
          ? { email: email.trim().toLowerCase(), password }
          : { phone: phone.trim(), password };

      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;

      if (data.session) {
        await setAuthenticated(data.session);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Login failed', error?.message ?? 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0F1021', '#1A1A2E', '#2B1D12']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <MotiView from={{ opacity: 0, translateY: -16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 450 }}>
            <Text style={styles.badge}>SPICECART</Text>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subheading}>Premium spices, faster checkout, zero friction.</Text>
          </MotiView>

          <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: 120, duration: 400 }} style={styles.card}>
            <View style={styles.toggle}>
              {(['email', 'phone'] as LoginMethod[]).map((mode) => (
                <Pressable key={mode} onPress={() => setLoginMethod(mode)} style={[styles.toggleBtn, loginMethod === mode && styles.toggleBtnActive]}>
                  <Text style={[styles.toggleText, loginMethod === mode && styles.toggleTextActive]}>{mode === 'email' ? 'Email' : 'Phone'}</Text>
                </Pressable>
              ))}
            </View>

            {loginMethod === 'email' ? (
              <TextInput
                style={styles.input}
                placeholder="name@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            ) : (
              <View style={styles.phoneRow}>
                <Text style={styles.code}>+91</Text>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="Phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            )}

            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#E2B714" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.linkWrap}>
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button title={isLoading ? 'AUTHENTICATING...' : 'LOGIN'} onPress={handleLogin} disabled={isLoading || !isFormValid} style={styles.loginBtn} />

            <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.linkWrap}>
              <Text style={styles.link}>New here? Create account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setGuest(true);
                router.replace('/(tabs)');
              }}
              style={styles.guestBtn}
            >
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  badge: { color: '#E2B714', letterSpacing: 2, fontSize: 12, marginBottom: 10 },
  heading: { color: '#FFF8E7', fontSize: 34, fontWeight: '800' },
  subheading: { color: '#D1D5DB', marginTop: 8, marginBottom: 22 },
  card: { backgroundColor: 'rgba(12,12,24,0.86)', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(226,183,20,0.22)' },
  toggle: { flexDirection: 'row', backgroundColor: '#111827', borderRadius: 12, padding: 4, marginBottom: 14 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10 },
  toggleBtnActive: { backgroundColor: '#E2B714' },
  toggleText: { textAlign: 'center', color: '#E5E7EB', fontWeight: '600' },
  toggleTextActive: { color: '#111827' },
  input: { backgroundColor: '#1F2937', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#FFF8E7', marginBottom: 12 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  code: { color: '#FFF8E7', backgroundColor: '#1F2937', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12 },
  phoneInput: { flex: 1 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', borderRadius: 12, paddingRight: 12, marginBottom: 2 },
  passwordInput: { flex: 1, marginBottom: 0, backgroundColor: 'transparent' },
  linkWrap: { alignSelf: 'flex-end', marginTop: 10 },
  link: { color: '#E2B714', fontWeight: '600' },
  loginBtn: { marginTop: 16 },
  guestBtn: { marginTop: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,248,231,0.25)' },
  guestText: { textAlign: 'center', color: '#FFF8E7', fontWeight: '700' },
});
