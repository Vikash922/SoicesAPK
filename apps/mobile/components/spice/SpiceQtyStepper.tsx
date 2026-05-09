import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface SpiceQtyStepperProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  style?: any;
}

export function SpiceQtyStepper({ 
  min = 1, 
  max = 99, 
  value, 
  onChange,
  style 
}: SpiceQtyStepperProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const scale = useSharedValue(1);

  const rQtyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleDecrease = () => {
    if (value > min) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSequence(withSpring(0.8), withSpring(1));
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSequence(withSpring(1.2), withSpring(1));
      onChange(value + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card || '#f5f5f5' }, style]}>
      <TouchableOpacity 
        onPress={handleDecrease} 
        style={[styles.btn, { opacity: value <= min ? 0.5 : 1 }]}
        disabled={value <= min}
      >
        <Ionicons name="remove" size={16} color={colors.text} />
      </TouchableOpacity>
      
      <Animated.View style={[styles.valContainer, rQtyStyle]}>
        <Text variant="body1" family="heading" style={styles.valueText}>{value}</Text>
      </Animated.View>
      
      <TouchableOpacity 
        onPress={handleIncrease} 
        style={[styles.btn, { opacity: value >= max ? 0.5 : 1 }]}
        disabled={value >= max}
      >
        <Ionicons name="add" size={16} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  btn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  valContainer: {
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  valueText: {
    textAlign: 'center',
  },
});
