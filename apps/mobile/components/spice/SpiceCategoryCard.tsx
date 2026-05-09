import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiPressable } from 'moti/interactions';

interface SpiceCategoryCardProps {
  id: string;
  label: string;
  icon: string;
  color: string;
  count?: number;
  onPress?: () => void;
}

export function SpiceCategoryCard({ label, icon, color, count, onPress }: SpiceCategoryCardProps) {
  return (
    <MotiPressable
      onPress={onPress}
      accessibilityLabel={`${label} category`}
      accessibilityRole="button"
      accessibilityHint={`Browse products in ${label}`}
      animate={({ pressed }) => {
        'worklet';
        return {
          scale: pressed ? 1.15 : 1,
        };
      }}
      transition={{ type: 'spring', damping: 10, stiffness: 200 }}
      style={styles.container}
    >
      <View style={styles.touchable}>
        <LinearGradient 
          colors={[color, color + 'aa']} 
          style={styles.iconContainer}
        >
          <Ionicons name={icon as any} size={28} color="#fff" />
        </LinearGradient>
        <Text variant="caption" family="heading" style={styles.label}>{label}</Text>
        {count !== undefined && (
          <Text variant="caption" style={styles.count}>{count} items</Text>
        )}
      </View>
    </MotiPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: 'transparent',
  },
  touchable: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
  count: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 2,
  },
});
