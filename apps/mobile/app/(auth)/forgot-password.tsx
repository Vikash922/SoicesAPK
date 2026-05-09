import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleReset = () => {
    if (email) {
      setIsSent(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {!isSent ? (
        <>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
            <Text variant="h1" family="display" style={styles.title}>Forgot Password</Text>
            <Text variant="body2" style={styles.subtitle}>
              Don't worry! It happens. Please enter your email address associated with your account.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.form}>
            <View style={styles.inputGroup}>
              <Text variant="overline" family="badge" style={styles.label}>EMAIL ADDRESS</Text>
              <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card }]}>
                <Ionicons name="mail-outline" size={20} color={colors.tabIconDefault} />
                <TextInput 
                  placeholder="name@example.com" 
                  placeholderTextColor={colors.tabIconDefault}
                  style={[styles.input, { color: colors.text }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <Button 
              title="SEND RESET LINK" 
              onPress={handleReset} 
              style={styles.resetButton}
              disabled={!email}
            />
          </Animated.View>
        </>
      ) : (
        <Animated.View entering={FadeInDown} style={styles.successContent}>
          <View style={[styles.iconCircle, { backgroundColor: colors.saffron + '20' }]}>
            <Ionicons name="mail-unread-outline" size={60} color={colors.saffron} />
          </View>
          <Text variant="h2" family="heading" style={styles.successTitle}>Check Your Email</Text>
          <Text variant="body2" style={styles.successSubtitle}>
            We've sent a password reset link to <Text family="heading">{email}</Text>
          </Text>
          
          <Button 
            title="BACK TO LOGIN" 
            onPress={() => router.replace('/(auth)/login')} 
            style={styles.backToLoginBtn}
          />
          
          <TouchableOpacity onPress={() => setIsSent(false)}>
            <Text variant="body2" family="heading" style={{ color: colors.saffron, marginTop: 20 }}>Try another email</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, marginBottom: 12 },
  subtitle: { opacity: 0.6, lineHeight: 22 },
  form: { flex: 1 },
  inputGroup: { marginBottom: 30 },
  label: { marginBottom: 8, opacity: 0.6 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    height: 60, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  input: { flex: 1, marginLeft: 12, fontSize: 16, fontFamily: 'Inter_400Regular' },
  resetButton: { height: 60, borderRadius: 16 },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  successTitle: { marginBottom: 12 },
  successSubtitle: { textAlign: 'center', opacity: 0.6, lineHeight: 22, paddingHorizontal: 20, marginBottom: 40 },
  backToLoginBtn: { width: '100%', height: 60, borderRadius: 16 },
});
