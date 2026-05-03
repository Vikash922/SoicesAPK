import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../Themed';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface SpiceHeatMeterProps {
  level: number; // 1-10
  showLabel?: boolean;
}

export function SpiceHeatMeter({ level, showLabel = true }: SpiceHeatMeterProps) {
  const animatedLevel = useSharedValue(0);

  useEffect(() => {
    animatedLevel.value = withTiming(level / 10, { duration: 1000 });
  }, [level]);

  const barStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedLevel.value,
      [0, 0.5, 1],
      ['#2E8B57', '#E8590C', '#C41E3A'] // Cardamom Green to Paprika Orange to Chili Red
    );

    return {
      width: `${animatedLevel.value * 100}%`,
      backgroundColor,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flame" size={16} color="#C41E3A" />
        <Text variant="caption" family="heading" style={styles.title}>SPICE HEAT METER</Text>
        {showLabel && (
          <Text variant="caption" style={styles.levelText}>{level}/10</Text>
        )}
      </View>
      <View style={styles.barContainer}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
      <View style={styles.labels}>
        <Text variant="overline" style={styles.label}>MILD</Text>
        <Text variant="overline" style={styles.label}>HOT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  title: {
    marginLeft: 6,
    opacity: 0.6,
  },
  levelText: {
    marginLeft: 'auto',
    fontWeight: 'bold',
  },
  barContainer: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 8,
    opacity: 0.4,
  },
});
