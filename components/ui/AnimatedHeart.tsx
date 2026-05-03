import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface AnimatedHeartProps {
  isLiked: boolean;
  onPress: () => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export function AnimatedHeart({ 
  isLiked, 
  onPress, 
  size = 24, 
  activeColor = '#C41E3A', 
  inactiveColor = '#A0A0B0' 
}: AnimatedHeartProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isLiked) {
      scale.value = withSequence(
        withSpring(1.5),
        withSpring(1)
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 500 })
      );
    }
  }, [isLiked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const particleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: interpolate(opacity.value, [0, 1], [0.5, 2]) }
    ],
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Ionicons 
          name={isLiked ? "heart" : "heart-outline"} 
          size={size} 
          color={isLiked ? activeColor : inactiveColor} 
        />
      </Animated.View>
      
      {/* Simple Particle Effect */}
      {isLiked && (
        <Animated.View style={[styles.particles, particleStyle]} pointerEvents="none">
           {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
             <View 
               key={angle} 
               style={[
                 styles.particle, 
                 { 
                   backgroundColor: activeColor,
                   transform: [
                     { rotate: `${angle}deg` },
                     { translateY: -20 }
                   ]
                 }
               ]} 
             />
           ))}
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

// Internal View for particles since Themed might add background
import { View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  particles: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  }
});
