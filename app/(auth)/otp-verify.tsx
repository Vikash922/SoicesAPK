import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OTPVerifyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
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

      <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
        <Text variant="h1" family="display" style={styles.title}>Verify Phone</Text>
        <Text variant="body2" style={styles.subtitle}>
          We've sent a 4-digit code to <Text family="heading">+91 98765 43210</Text>
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400)} style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpInput, 
              { 
                backgroundColor: colorScheme === 'light' ? '#fff' : colors.card,
                color: colors.text,
                borderColor: digit ? colors.saffron : 'transparent',
                borderWidth: 2
              }
            ]}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.timerRow}>
          {timer > 0 ? (
            <Text variant="caption">Resend code in <Text family="heading" style={{ color: colors.saffron }}>{timer}s</Text></Text>
          ) : (
            <TouchableOpacity onPress={() => setTimer(30)}>
              <Text variant="caption" family="heading" style={{ color: colors.saffron }}>RESEND CODE</Text>
            </TouchableOpacity>
          )}
        </View>

        <Button 
          title="VERIFY & CONTINUE" 
          onPress={() => router.replace('/(tabs)/')} 
          style={styles.verifyButton}
          disabled={otp.some(d => !d)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, marginBottom: 12 },
  subtitle: { opacity: 0.6, lineHeight: 22 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  otpInput: { 
    width: (width - 48 - 60) / 4, 
    height: 70, 
    borderRadius: 16, 
    textAlign: 'center', 
    fontSize: 24, 
    fontWeight: 'bold',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  footer: { marginTop: 'auto', marginBottom: 40 },
  timerRow: { alignItems: 'center', marginBottom: 24 },
  verifyButton: { height: 60, borderRadius: 16 },
});
