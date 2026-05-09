import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { MotiView } from 'moti';

export type BadgeType = 'organic' | 'premium' | 'authentic';

interface SpiceTrustBadgeProps {
  type: BadgeType;
  label?: string;
  delay?: number;
}

export function SpiceTrustBadge({ type, label, delay = 0 }: SpiceTrustBadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getBadgeConfig = () => {
    switch(type) {
      case 'organic':
        return { icon: 'leaf', color: colors.cardamom, defaultLabel: '100% Organic' };
      case 'premium':
        return { icon: 'star', color: colors.saffron, defaultLabel: 'Premium Quality' };
      case 'authentic':
        return { icon: 'shield-checkmark', color: '#3498DB', defaultLabel: 'Authentic' };
      default:
        return { icon: 'checkmark-circle', color: colors.text, defaultLabel: 'Verified' };
    }
  };

  const config = getBadgeConfig();

  return (
    <MotiView 
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300, delay }}
      style={[styles.container, { backgroundColor: config.color + '15', borderColor: config.color + '40' }]}
    >
      <Ionicons name={config.icon as any} size={14} color={config.color} style={styles.icon} />
      <Text variant="caption" style={[styles.label, { color: config.color }]}>
        {label || config.defaultLabel}
      </Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: '600',
  },
});