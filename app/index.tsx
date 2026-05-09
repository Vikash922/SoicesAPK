import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const onboardingComplete = useUIStore((state) => state.onboardingComplete);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Animation Values
  const iconScale = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const loadingWidth = useSharedValue(0);
  const splashOpacity = useSharedValue(1);
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    // Icon Animation
    iconScale.value = withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 400 })
    );
    iconRotate.value = withTiming(360, { duration: 1500, easing: Easing.out(Easing.exp) });

    // Text Fade In
    textOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));

    const typing = setInterval(() => {
      setTypedCount((v) => (v < 9 ? v + 1 : v));
    }, 120);

    // Loading Bar
    loadingWidth.value = withDelay(500, withTiming(1, { duration: 2000 }));

    // Navigation logic
    const timeout = setTimeout(() => {
      splashOpacity.value = withTiming(0, { duration: 500 }, () => {
        if (!onboardingComplete) {
          runOnJS(router.replace)('/onboarding');
        } else if (!isAuthenticated) {
          runOnJS(router.replace)('/(auth)/login');
        } else {
          runOnJS(router.replace)('/(tabs)');
        }
      });
    }, 3500);

    return () => { clearTimeout(timeout); clearInterval(typing); };
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` }
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const loadingStyle = useAnimatedStyle(() => ({
    width: `${loadingWidth.value * 100}%`,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <Ionicons name="flame" size={80} color="#E2B714" />
        </Animated.View>

        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text variant="display1" family="display" style={styles.title}>{'SPICECART'.slice(0, typedCount)}</Text>
          <Text variant="body1" style={styles.subtitle}>The World of Spices</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.loadingBarContainer}>
          <Animated.View style={[styles.loadingBar, loadingStyle]}>
            <LinearGradient
              colors={['#E2B714', '#E8590C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </View>
      
      {/* Floating Particles Emulation (Simple version) */}
      <View style={styles.particlesContainer} pointerEvents="none">
         {['🌶️','🌿','🧂','🥘','🍲','🫚','🌱','🍛','🌶️','🥄','🌿','🧂','🍲','🫚','🌱'].map((emoji, i) => (
           <FloatingEmoji key={i} emoji={emoji} index={i} />
         ))}
      </View>
    </Animated.View>
  );
}

function FloatingEmoji({ emoji, index }: { emoji: string; index: number }) {
  const y = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(index * 400, withTiming(-100, { duration: 4000, easing: Easing.linear }));
    opacity.value = withDelay(index * 400, withSequence(
      withTiming(0.8, { duration: 500 }),
      withDelay(3000, withTiming(0, { duration: 500 }))
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: (width / 5) * index + 20,
    top: y.value,
    opacity: opacity.value,
    fontSize: 24,
  }));

  return <Animated.Text style={style}>{emoji}</Animated.Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    color: '#E2B714',
    letterSpacing: 4,
  },
  subtitle: {
    color: '#E2B714',
    opacity: 0.7,
    marginTop: 8,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 60,
    paddingBottom: 100,
    backgroundColor: 'transparent',
  },
  loadingBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  }
});
