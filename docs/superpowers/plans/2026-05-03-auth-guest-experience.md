# SpiceCart Authentication & Guest Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a smooth transition from onboarding to either Guest browsing or Secure Login, with a high-fidelity "amber waves" background.

**Architecture:** Use Zustand for state management (`useAuthStore`), React Native Reanimated for the background animation, and Firebase Auth for the backend logic.

**Tech Stack:** React Native, Expo, Zustand, Reanimated, Firebase Auth.

---

### Task 1: Update Auth Store for Guest Support

**Files:**
- Modify: `Spicesapk/store/useAuthStore.ts`

- [ ] **Step 1: Add isGuest state and login/logout handlers**

```typescript
// Spicesapk/store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: any | null;
  setAuthenticated: (value: boolean, user?: any) => void;
  setGuest: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isGuest: false,
      user: null,
      setAuthenticated: (value, user = null) => set({ isAuthenticated: value, user, isGuest: false }),
      setGuest: (value) => set({ isGuest: value, isAuthenticated: false, user: null }),
      logout: () => set({ isAuthenticated: false, isGuest: false, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

- [ ] **Step 2: Commit**

```bash
git add Spicesapk/store/useAuthStore.ts
git commit -m "feat: add guest support to useAuthStore"
```

---

### Task 2: Create AnimatedBackground Component (Amber Waves)

**Files:**
- Create: `Spicesapk/components/ui/AnimatedBackground.tsx`

- [ ] **Step 1: Implement the wave animation using Reanimated**

```tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const AnimatedBackground = () => {
  const animValue = useSharedValue(0);

  useEffect(() => {
    animValue.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const wave1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(animValue.value, [0, 1], [0, -width]) },
      { translateY: Math.sin(animValue.value * Math.PI * 2) * 20 }
    ],
    opacity: 0.3,
  }));

  const wave2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(animValue.value, [0, 1], [-width, 0]) },
      { translateY: Math.cos(animValue.value * Math.PI * 2) * 15 }
    ],
    opacity: 0.2,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={StyleSheet.absoluteFill} />
      
      <Animated.View style={[styles.wave, wave1Style]}>
        <LinearGradient
          colors={['transparent', '#E2B71440', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.waveGradient}
        />
      </Animated.View>

      <Animated.View style={[styles.wave, wave2Style]}>
        <LinearGradient
          colors={['transparent', '#E8590C30', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.waveGradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  wave: { position: 'absolute', width: width * 2, height: height, top: 0 },
  waveGradient: { flex: 1 },
});
```

- [ ] **Step 2: Commit**

```bash
git add Spicesapk/components/ui/AnimatedBackground.tsx
git commit -m "feat: add AnimatedBackground component with Reanimated waves"
```

---

### Task 3: Implement Login Screen UI

**Files:**
- Modify: `Spicesapk/app/(auth)/login.tsx`

- [ ] **Step 1: Write the Login Screen with Background and Guest option**

```tsx
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
                <Text>+91</Text>
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
                style={[styles.input, { flex: 1 }]}
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
  input: { padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFF' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, paddingRight: 10 },
  loginButton: { marginTop: 20 },
  guestButton: { marginTop: 20, alignItems: 'center' },
  guestText: { color: '#E2B714', textDecorationLine: 'underline' }
});
```

- [ ] **Step 2: Commit**

```bash
git add Spicesapk/app/(auth)/login.tsx
git commit -m "feat: implement Login screen with AnimatedBackground and Guest support"
```

---

### Task 4: Update Onboarding Navigation Logic

**Files:**
- Modify: `Spicesapk/app/onboarding/index.tsx`

- [ ] **Step 1: Link "SKIP" and "GET STARTED" to new flows**

```tsx
// Spicesapk/app/onboarding/index.tsx (handleFinish update)
  const setGuest = useAuthStore((state) => state.setGuest);
  
  const handleFinish = () => {
    setOnboardingComplete(true);
    router.replace('/(auth)/login');
  };

  const handleSkip = () => {
    setOnboardingComplete(true);
    setGuest(true);
    router.replace('/(tabs)');
  };
```

- [ ] **Step 2: Commit**

```bash
git add Spicesapk/app/onboarding/index.tsx
git commit -m "feat: update onboarding navigation to support Skip as Guest"
```
