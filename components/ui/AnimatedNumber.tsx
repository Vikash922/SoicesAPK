import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  FadeInDown,
  FadeOutUp
} from 'react-native-reanimated';

interface AnimatedNumberProps {
  value: number;
  style?: any;
}

export function AnimatedNumber({ value, style }: AnimatedNumberProps) {
  const prevValue = useRef(value);

  return (
    <View style={styles.container}>
      <Animated.View 
        key={value}
        entering={value > prevValue.current ? FadeInDown : FadeInUp}
        exiting={value > prevValue.current ? FadeOutUp : FadeInDown}
      >
        <Text variant="body1" family="heading" style={[styles.text, style]}>{value}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
  },
  text: {
    textAlign: 'center',
  }
});
