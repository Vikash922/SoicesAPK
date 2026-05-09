import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  interpolate 
} from 'react-native-reanimated';

interface SpiceRatingBarProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  style?: any;
}

const Star = ({ index, rating, size, color }: { index: number, rating: number, size: number, color: string }) => {
  const fillAnim = useSharedValue(0);

  useEffect(() => {
    let target = 0;
    if (rating >= index + 1) {
      target = 1; // Full star
    } else if (rating > index && rating < index + 1) {
      target = rating - index; // Half star (fractional)
    }
    
    fillAnim.value = withDelay(index * 100, withTiming(target, { duration: 400 }));
  }, [rating]);

  const rStyle = useAnimatedStyle(() => ({
    width: interpolate(fillAnim.value, [0, 1], [0, size]),
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
  }));

  return (
    <View style={{ width: size, height: size, marginRight: size * 0.2 }}>
      {/* Empty Star */}
      <Ionicons name="star-outline" size={size} color="rgba(0,0,0,0.15)" style={{ position: 'absolute' }} />
      {/* Filled Star with animated width */}
      <Animated.View style={rStyle}>
        <Ionicons name="star" size={size} color={color} />
      </Animated.View>
    </View>
  );
};

export function SpiceRatingBar({ rating, count, size = 'md', style }: SpiceRatingBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 18 : 24;
  const textSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsRow}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} index={i} rating={rating} size={iconSize} color={colors.turmeric} />
        ))}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.ratingText, { fontSize: textSize, color: colors.text }]}>{rating.toFixed(1)}</Text>
        {count !== undefined && (
          <Text style={[styles.countText, { fontSize: textSize * 0.85 }]}>({count.toLocaleString()})</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 4,
  },
  ratingText: {
    fontWeight: 'bold',
  },
  countText: {
    marginLeft: 4,
    opacity: 0.5,
  },
});
