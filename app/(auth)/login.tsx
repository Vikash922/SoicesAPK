import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { MotiView } from 'moti';

// Ensure the browser can handle the redirect back to the app
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const { setAuthenticated, setGuest } = useAuthStore();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      const credentials = loginMethod === 'email' 
        ? { email, password } 
        : { phone, password };

      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) throw error;

      if (data.session) {
        await setAuthenticated(data.session);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    setGuest(true);
    router.replace('/(tabs)');
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      setIsLoading(true);
      const redirectUrl = Linking.createURL('/(auth)/login');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success') {
          const { url } = result;
          const params = Linking.parse(url);
          
          if (params.queryParams?.access_token) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: params.queryParams.access_token as string,
              refresh_token: params.queryParams.refresh_token as string,
            });
            if (sessionError) throw sessionError;
            
            if (sessionData.session) {
              await setAuthenticated(sessionData.session);
              router.replace('/(tabs)');
            }
          }
        }
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <MotiView 
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
            style={styles.header}
          >
            <Text variant="display2" family="display" style={styles.title}>Welcome Back</Text>
            <Text variant="body1" style={styles.subtitle}>Taste the excellence of pure spices</Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 200, type: 'timing', duration: 600 }}
            style={styles.methodToggle}
          >
            <TouchableOpacity 
              style={[styles.methodBtn, loginMethod === 'phone' && styles.methodBtnActive]} 
              onPress={() => setLoginMethod('phone')}
            >
              <Text style={[styles.methodBtnText, loginMethod === 'phone' && styles.methodBtnTextActive]}>Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.methodBtn, loginMethod === 'email' && styles.methodBtnActive]} 
              onPress={() => setLoginMethod('email')}
            >
              <Text style={[styles.methodBtnText, loginMethod === 'email' && styles.methodBtnTextActive]}>Email</Text>
            </TouchableOpacity>
          </MotiView>

          <View style={styles.form}>
            {loginMethod === 'phone' ? (
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 300 }}
                style={styles.inputContainer}
              >
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
              </MotiView>
            ) : (
              <MotiView
                from={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 300 }}
                style={styles.inputContainer}
              >
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </MotiView>
            )}

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 400 }}
              style={styles.inputContainer}
            >
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
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#E2B714" />
                </TouchableOpacity>
              </View>
            </MotiView>

            <MotiView 
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 500 }}
              style={styles.extraRow}
            >
              <TouchableOpacity 
                style={styles.rememberRow} 
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <Switch value={rememberMe} onValueChange={setRememberMe} />
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 600 }}
            >
              <Button 
                title={isLoading ? "AUTHENTICATING..." : "LOGIN"} 
                onPress={handleLogin} 
                style={styles.loginButton} 
                disabled={isLoading}
              />
            </MotiView>
            
            <MotiView 
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 700 }}
              style={styles.dividerContainer}
            >
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </MotiView>

            <MotiView 
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 800 }}
              style={styles.socialRow}
            >
              <TouchableOpacity 
                style={styles.socialButton} 
                onPress={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={24} color="#FFF" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton} 
                onPress={() => handleSocialLogin('apple')}
                disabled={isLoading}
              >
                <Ionicons name="logo-apple" size={24} color="#FFF" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </MotiView>

            <MotiView 
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 900 }}
              style={styles.footer}
            >
              <Text style={styles.footerText}>New to SpiceCart? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.registerText}>Register Now</Text>
              </TouchableOpacity>
            </MotiView>

            <MotiView 
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1000 }}
            >
              <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
                <Text style={styles.guestText}>Continue as Guest</Text>
              </TouchableOpacity>
            </MotiView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  scrollContent: { paddingHorizontal: 30, paddingVertical: 60, justifyContent: 'center', minHeight: '100%' },
  header: { marginBottom: 30, backgroundColor: 'transparent' },
  title: { color: '#E2B714' },
  subtitle: { color: '#E2B714', opacity: 0.7, marginTop: 8 },
  methodToggle: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 15, 
    padding: 4, 
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(226, 183, 20, 0.1)'
  },
  methodBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  methodBtnActive: { backgroundColor: 'rgba(226, 183, 20, 0.2)' },
  methodBtnText: { color: '#FFF', opacity: 0.6, fontWeight: '600' },
  methodBtnTextActive: { color: '#E2B714', opacity: 1 },
  form: { backgroundColor: 'transparent' },
  inputContainer: { marginBottom: 15, backgroundColor: 'transparent' },
  label: { color: '#E2B714', marginBottom: 8, fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 },
  phoneInputRow: { flexDirection: 'row', alignItems: 'center' },
  countryCode: { padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: 'rgba(226, 183, 20, 0.1)' },
  countryCodeText: { color: '#FFF' },
  input: { padding: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, color: '#FFF', flex: 1, borderWidth: 1, borderColor: 'rgba(226, 183, 20, 0.1)', fontFamily: 'Inter_400Regular' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingRight: 10, borderWidth: 1, borderColor: 'rgba(226, 183, 20, 0.1)' },
  eyeIcon: { padding: 5 },
  extraRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, marginBottom: 20 },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  rememberText: { color: '#FFF', marginLeft: 10, fontSize: 13, opacity: 0.8 },
  forgotText: { color: '#E2B714', fontSize: 13, fontWeight: '600' },
  loginButton: { height: 56, borderRadius: 15 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(226, 183, 20, 0.2)' },
  dividerText: { color: '#E2B714', marginHorizontal: 15, fontSize: 11, opacity: 0.6, letterSpacing: 1 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  socialButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 14, 
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(226, 183, 20, 0.1)'
  },
  socialButtonText: { color: '#FFF', marginLeft: 10, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#FFF', opacity: 0.6 },
  registerText: { color: '#E2B714', fontWeight: 'bold' },
  guestButton: { marginTop: 20, alignItems: 'center' },
  guestText: { color: '#E2B714', textDecorationLine: 'underline', opacity: 0.7, fontSize: 13 }
});


