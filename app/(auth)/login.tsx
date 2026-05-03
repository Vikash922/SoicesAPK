import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown, useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useAuthStore } from '@/store/useAuthStore';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const setGuestMode = useAuthStore((state) => state.setGuestMode);

  const handleLogin = () => {
    // Mock login
    login({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: phoneNumber
    });
    router.replace('/(tabs)');
  };

  const handleGuestMode = () => {
    setGuestMode(true);
    router.replace('/(tabs)');
  };

  const socialScale = {
    google: useSharedValue(1),
    apple: useSharedValue(1),
    phone: useSharedValue(1),
  };

  const handleSocialPress = (type: 'google' | 'apple' | 'phone') => {
    socialScale[type].value = withSpring(0.95, {}, () => {
      socialScale[type].value = withSpring(1);
    });
  };

  const animatedSocialStyle = (type: 'google' | 'apple' | 'phone') => useAnimatedStyle(() => ({
    transform: [{ scale: socialScale[type].value }],
  }));

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        {/* Animated Background Mesh - Using Linear Gradient as approximation */}
        <LinearGradient
          colors={colorScheme === 'light' ? ['#FFF8E7', '#FFE4B5', '#FFF8E7'] : ['#1A1A2E', '#16213E', '#1A1A2E']}
          style={styles.background}
        />

        <Animated.View entering={FadeInDown.delay(200).duration(1000)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: colors.saffron }]}>
              <Ionicons name="flame" size={40} color="#000" />
            </View>
            <Text variant="display1" family="display" style={styles.brandTitle}>SpiceCart</Text>
            <Text variant="body1" style={styles.subtitle}>Welcome back!</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(1000)} style={styles.form}>
          <View style={styles.inputGroup}>
            <Text variant="overline" family="badge" style={styles.label}>PHONE NUMBER</Text>
            <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card }]}>
              <Text variant="body1" family="heading" style={styles.countryCode}>+91</Text>
              <View style={styles.verticalDivider} />
              <TextInput 
                placeholder="00000 00000" 
                placeholderTextColor={colors.tabIconDefault}
                style={[styles.input, { color: colors.text }]}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text variant="overline" family="badge" style={styles.label}>PASSWORD</Text>
            <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.tabIconDefault} />
              <TextInput 
                placeholder="••••••••" 
                placeholderTextColor={colors.tabIconDefault}
                style={[styles.input, { color: colors.text }]}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={colors.tabIconDefault} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <Button 
            title="LOGIN" 
            onPress={handleLogin} 
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: colors.tabIconDefault }]} />
            <Text variant="caption" style={styles.dividerText}>or continue with</Text>
            <View style={[styles.line, { backgroundColor: colors.tabIconDefault }]} />
          </View>

          <View style={styles.socialRow}>
            <Animated.View style={animatedSocialStyle('google')}>
              <TouchableOpacity 
                style={[styles.socialBtn, { borderColor: colors.tabIconDefault + '30' }]}
                onPress={() => handleSocialPress('google')}
              >
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={animatedSocialStyle('phone')}>
              <TouchableOpacity 
                style={[styles.socialBtn, { borderColor: colors.tabIconDefault + '30' }]}
                onPress={() => handleSocialPress('phone')}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.cardamom} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={animatedSocialStyle('apple')}>
              <TouchableOpacity 
                style={[styles.socialBtn, { borderColor: colors.tabIconDefault + '30' }]}
                onPress={() => handleSocialPress('apple')}
              >
                <Ionicons name="logo-apple" size={24} color={colors.text} />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.footer}>
            <Text variant="body2">New here? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text variant="body2" family="heading" style={{ color: colors.saffron }}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <TouchableOpacity 
            style={styles.guestButton}
            onPress={handleGuestMode}
          >
            <Text variant="body2" style={{ opacity: 0.6 }}>Continue as Guest</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  header: {
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  brandTitle: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.6,
  },
  form: {
    backgroundColor: 'transparent',
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  label: {
    marginBottom: 8,
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  countryCode: {
    marginRight: 12,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  loginButton: {
    height: 60,
    borderRadius: 16,
    marginTop: 10,
    elevation: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    backgroundColor: 'transparent',
  },
  line: {
    flex: 1,
    height: 1,
    opacity: 0.1,
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.4,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  guestButton: {
    alignSelf: 'center',
    padding: 8,
  },
});
