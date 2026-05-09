import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';

const FlipCard = ({ value }: { value: string }) => {
  const rotation = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);

  useEffect(() => {
    if (value !== displayValue) {
      setNextValue(value);
      rotation.value = 0;
      rotation.value = withTiming(1, { duration: 400 }, (finished) => {
        if (finished) {
           runOnJS(setDisplayValue)(value);
        }
      });
    }
  }, [value]);

  const frontStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(rotation.value, [0, 0.5], [0, -90], Extrapolate.CLAMP);
    return {
      transform: [{ perspective: 400 }, { rotateX: `${rotateX}deg` }],
      opacity: rotation.value > 0.5 ? 0 : 1,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(rotation.value, [0.5, 1], [90, 0], Extrapolate.CLAMP);
    return {
      transform: [{ perspective: 400 }, { rotateX: `${rotateX}deg` }],
      opacity: rotation.value > 0.5 ? 1 : 0,
    };
  });

  return (
    <View style={styles.cardContainer}>
      <Animated.View style={[styles.card, styles.upper, frontStyle]}>
        <Text style={styles.text}>{displayValue}</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.lower, backStyle]}>
        <Text style={styles.text}>{nextValue}</Text>
      </Animated.View>
    </View>
  );
};

export const FlipClock = () => {
  const [timeLeft, setTimeId] = useState({ h: '00', m: '45', s: '12' });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTimeId({
        h: String(now.getHours()).padStart(2, '0'),
        m: String(now.getMinutes()).padStart(2, '0'),
        s: String(now.getSeconds()).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlipCard value={timeLeft.h} />
      <Text style={styles.separator}>:</Text>
      <FlipCard value={timeLeft.m} />
      <Text style={styles.separator}>:</Text>
      <FlipCard value={timeLeft.s} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    width: 40,
    height: 50,
    marginHorizontal: 2,
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#16213E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  upper: {
    backgroundColor: '#1A1A2E',
  },
  lower: {
    backgroundColor: '#16213E',
  },
  text: {
    fontSize: 24,
    color: '#E2B714',
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontWeight: 'bold',
  },
  separator: {
    fontSize: 24,
    color: '#E2B714',
    marginHorizontal: 4,
    fontWeight: 'bold',
  },
});
