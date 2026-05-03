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
