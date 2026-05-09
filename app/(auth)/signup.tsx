import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { setAuthenticated } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        // User is signed in immediately (email confirmation disabled)
        await setAuthenticated(data.session);
        router.replace('/(tabs)');
      } else {
        // Confirmation email sent
        setIsVerificationSent(true);
      }
    } catch (error: any) {
      Alert.alert('Signup Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={[styles.successIconContainer, { backgroundColor: colors.cardamom + '22' }]}>
          <Ionicons name="mail-unread-outline" size={60} color={colors.cardamom} />
        </View>
        <Text variant="h1" family="heading" style={{ marginTop: 24, textAlign: 'center' }}>Verify your email</Text>
        <Text variant="body1" style={{ marginTop: 12, textAlign: 'center', opacity: 0.7, paddingHorizontal: 20 }}>
          We've sent a verification link to <Text family="heading" style={{ color: colors.saffron }}>{email}</Text>.
        </Text>
        <Text variant="caption" style={{ marginTop: 24, textAlign: 'center', opacity: 0.5 }}>
          Please click the link in the email to complete your registration. This page will update automatically.
        </Text>
        
        <Button 
          title="BACK TO LOGIN" 
          onPress={() => router.replace('/(auth)/login')} 
          style={{ width: '100%', marginTop: 40, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border }}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="display1" family="display" style={styles.title}>Create Account</Text>
        <Text variant="body1" style={styles.subtitle}>Join SpiceCart and explore the world of flavors</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text variant="overline" family="badge" style={styles.label}>FULL NAME</Text>
          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.tabIconDefault} />
            <TextInput 
              placeholder="Enter your full name" 
              placeholderTextColor={colors.tabIconDefault}
              style={[styles.input, { color: colors.text }]}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text variant="overline" family="badge" style={styles.label}>EMAIL ADDRESS</Text>
          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.tabIconDefault} />
            <TextInput 
              placeholder="Enter your email" 
              placeholderTextColor={colors.tabIconDefault}
              style={[styles.input, { color: colors.text }]}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text variant="overline" family="badge" style={styles.label}>PASSWORD</Text>
          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.tabIconDefault} />
            <TextInput 
              placeholder="Create a password" 
              placeholderTextColor={colors.tabIconDefault}
              style={[styles.input, { color: colors.text }]}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <View style={styles.terms}>
          <Text variant="caption" style={{ color: colors.text }}>By signing up, you agree to our </Text>
          <TouchableOpacity>
            <Text variant="caption" family="heading" style={{ color: colors.saffron }}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        <Button 
          title="Create Account" 
          onPress={handleSignup} 
          style={styles.signupButton}
          disabled={isLoading}
          loading={isLoading}
        />

        <View style={styles.footer}>
          <Text variant="body2" style={{ color: colors.text }}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text variant="body2" family="heading" style={{ color: colors.saffron }}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 48,
    backgroundColor: 'transparent',
  },
  title: {
    marginBottom: 8,
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
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  terms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  signupButton: {
    height: 56,
    marginBottom: 24,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});