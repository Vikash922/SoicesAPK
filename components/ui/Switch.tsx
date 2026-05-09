import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useEffect } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Switch({ value, onValueChange }: SwitchProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const translateX = useSharedValue(value ? 20 : 2);

  React.useEffect(() => {
    translateX.value = withSpring(value ? 20 : 2, { damping: 15, stiffness: 200 });
  }, [value]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => onValueChange(!value)}
      style={[
        styles.container, 
        { backgroundColor: value ? colors.saffron : colors.border }
      ]}
    >
      <Animated.View style={[styles.circle, animatedCircleStyle]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});