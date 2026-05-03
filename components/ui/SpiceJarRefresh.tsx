import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate,
  useDerivedValue
} from 'react-native-reanimated';
import { Text } from '@/components/Themed';

export const SpiceJarRefresh = ({ progress }: { progress: Animated.SharedValue<number> }) => {
  const rotate = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [0, 45]);
  });

  const jarStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: interpolate(progress.value, [0, 1], [0.8, 1.2]) }],
    opacity: progress.value,
  }));

  const powderHeight = useSharedValue(0);
  
  useEffect(() => {
    if (progress.value > 0.9) {
      powderHeight.value = withRepeat(withTiming(40, { duration: 1000 }), -1, true);
    } else {
      powderHeight.value = 0;
    }
  }, [progress.value]);

  const powderStyle = useAnimatedStyle(() => ({
    height: powderHeight.value,
    opacity: interpolate(progress.value, [0.8, 1], [0, 1]),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.jarContainer, jarStyle]}>
        <Text style={{ fontSize: 40 }}>🏺</Text>
      </Animated.View>
      <Animated.View style={[styles.powder, powderStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  jarContainer: { zIndex: 2 },
  powder: { width: 3, backgroundColor: '#E2B714', borderRadius: 2, marginTop: -10 },
});
