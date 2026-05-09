import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '../Themed';

interface BadgeProps {
  label: string;
  color?: string;
  style?: ViewStyle;
}

export function Badge({ label, color = '#E8590C', style }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'SpaceGrotesk-SemiBold',
  },
});