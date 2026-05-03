import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="display1" family="display" style={styles.title}>Create Account</Text>
        <Text variant="body1" style={styles.subtitle}>Join SpiceCart and explore the world of flavors</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text variant="overline" family="badge" style={styles.label}>FULL NAME</Text>
          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card }]}>
            <Ionicons name="person-outline" size={20} color={colors.tabIconDefault} />
            <TextInput 
              placeholder="Enter your full name" 
              placeholderTextColor={colors.tabIconDefault}
              style={[styles.input, { color: colors.text }]}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text variant="overline" family="badge" style={styles.label}>EMAIL ADDRESS</Text>
          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card }]}>
            <Ionicons name="mail-outline" size={20} color={colors.tabIconDefault} />
            <TextInput 
              placeholder="Enter your email" 
              placeholderTextColor={colors.tabIconDefault}
              style={[styles.input, { color: colors.text }]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text variant="overline" family="badge" style={styles.label}>PASSWORD</Text>
          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.tabIconDefault} />
            <TextInput 
              placeholder="Create a password" 
              placeholderTextColor={colors.tabIconDefault}
              style={[styles.input, { color: colors.text }]}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.terms}>
          <Text variant="caption">By signing up, you agree to our </Text>
          <TouchableOpacity>
            <Text variant="caption" family="heading" style={{ color: colors.saffron }}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        <Button 
          title="Create Account" 
          onPress={() => router.replace('/(tabs)')} 
          style={styles.signupButton}
        />

        <View style={styles.footer}>
          <Text variant="body2">Already have an account? </Text>
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
    borderColor: 'transparent',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
