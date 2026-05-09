import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

const { width } = Dimensions.get('window');

interface SpiceShimmerLoaderProps {
  variant?: 'card' | 'list' | 'banner';
  style?: any;
}

export function SpiceShimmerLoader({ variant = 'card', style }: SpiceShimmerLoaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const shimmerValue = useSharedValue(-1);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerValue.value, [-1, 1], [-width, width]);
    return {
      transform: [{ translateX }],
    };
  });

  const backgroundColor = colorScheme === 'light' ? '#E1E1E1' : '#16213E';
  const highlightColor = colorScheme === 'light' ? '#F2F2F2' : '#1A1A2E';

  if (variant === 'card') {
    return (
      <View style={[styles.cardContainer, { backgroundColor }, style]}>
        <View style={styles.shimmerWrapper}>
          <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            <LinearGradient
              colors={[backgroundColor, highlightColor, backgroundColor]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <View style={styles.cardContent}>
          <View style={[styles.titleLine, { backgroundColor: highlightColor }]} />
          <View style={[styles.priceLine, { backgroundColor: highlightColor }]} />
        </View>
      </View>
    );
  }

  if (variant === 'list') {
    return (
      <View style={[styles.listContainer, { backgroundColor }, style]}>
        <View style={[styles.listImage, { backgroundColor: highlightColor }]} />
        <View style={styles.listContent}>
          <View style={[styles.titleLine, { backgroundColor: highlightColor, width: '80%' }]} />
          <View style={[styles.priceLine, { backgroundColor: highlightColor, width: '40%' }]} />
        </View>
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
          <LinearGradient
            colors={['transparent', highlightColor + '44', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.bannerContainer, { backgroundColor }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[backgroundColor, highlightColor, backgroundColor]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    height: 240,
  },
  shimmerWrapper: {
    height: 160,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 12,
  },
  titleLine: {
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  priceLine: {
    height: 14,
    width: '60%',
    borderRadius: 7,
  },
  listContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  listContent: {
    flex: 1,
    marginLeft: 15,
  },
  bannerContainer: {
    width: width - 40,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
});
