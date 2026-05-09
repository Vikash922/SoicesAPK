import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface DividerProps {
  style?: ViewStyle;
}

export function Divider({ style }: DividerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.divider, { backgroundColor: colors.border }, style]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});