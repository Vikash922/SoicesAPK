import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const setGuest = useAuthStore((state) => state.setGuest);

  const handleLogin = () => {
    // Placeholder login logic
    router.replace('/(tabs)');
  };

  const handleGuest = () => {
    setGuest(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text variant="display2" family="display" style={styles.title}>Welcome Back</Text>
          <Text variant="body1" style={styles.subtitle}>Taste the excellence of pure spices</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, backgroundColor: 'transparent' }]}
                placeholder="Enter password"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#E2B714" />
              </TouchableOpacity>
            </View>
          </View>

          <Button title="LOGIN" onPress={handleLogin} style={styles.loginButton} />
          
          <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  header: { marginBottom: 40, backgroundColor: 'transparent' },
  title: { color: '#E2B714' },
  subtitle: { color: '#E2B714', opacity: 0.7, marginTop: 8 },
  form: { backgroundColor: 'transparent' },
  inputContainer: { marginBottom: 20, backgroundColor: 'transparent' },
  label: { color: '#E2B714', marginBottom: 8, fontSize: 12, fontWeight: 'bold' },
  phoneInputRow: { flexDirection: 'row', alignItems: 'center' },
  countryCode: { padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, marginRight: 10 },
  countryCodeText: { color: '#FFF' },
  input: { padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFF' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, paddingRight: 10 },
  loginButton: { marginTop: 20 },
  guestButton: { marginTop: 20, alignItems: 'center' },
  guestText: { color: '#E2B714', textDecorationLine: 'underline' }
});
