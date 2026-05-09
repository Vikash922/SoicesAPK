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
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface SpiceCountdownTimerProps {
  endTime: Date;
  style?: any;
}

const FlipCard = ({ value, colors }: { value: string, colors: any }) => {
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
      <Animated.View style={[styles.card, styles.upper, frontStyle, { backgroundColor: colors.card || '#333' }]}>
        <Text style={[styles.text, { color: colors.saffron }]}>{displayValue}</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.lower, backStyle, { backgroundColor: colors.card || '#222' }]}>
        <Text style={[styles.text, { color: colors.saffron }]}>{nextValue}</Text>
      </Animated.View>
    </View>
  );
};

export const SpiceCountdownTimer = ({ endTime, style }: SpiceCountdownTimerProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();
      let timeLeft = { h: '00', m: '00', s: '00' };

      if (difference > 0) {
        timeLeft = {
          h: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
          m: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
          s: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
        };
      }
      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <View style={[styles.container, style]}>
      <FlipCard value={timeLeft.h} colors={colors} />
      <Text style={[styles.separator, { color: colors.saffron }]}>:</Text>
      <FlipCard value={timeLeft.m} colors={colors} />
      <Text style={[styles.separator, { color: colors.saffron }]}>:</Text>
      <FlipCard value={timeLeft.s} colors={colors} />
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  upper: {
    zIndex: 2,
  },
  lower: {
    zIndex: 1,
  },
  text: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontWeight: 'bold',
  },
  separator: {
    fontSize: 24,
    marginHorizontal: 4,
    fontWeight: 'bold',
  },
});
