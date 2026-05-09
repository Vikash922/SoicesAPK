import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  interpolate,
  SharedValue,
  Extrapolate
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export const SpiceJarRefresh = ({ progress }: { progress: SharedValue<number> }) => {
  const lottieRef = useRef<LottieView>(null);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.5, 1], [0, 1, 1], Extrapolate.CLAMP),
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [-20, 0], Extrapolate.CLAMP) },
        { scale: interpolate(progress.value, [0, 1], [0.8, 1], Extrapolate.CLAMP) }
      ],
      height: interpolate(progress.value, [0, 1], [0, 100], Extrapolate.CLAMP),
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <AnimatedLottieView
        ref={lottieRef}
        source={require('@/assets/lottie/jar_pour.json')}
        progress={progress}
        style={styles.lottie}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  lottie: {
    width: 80,
    height: 80,
  },
});
