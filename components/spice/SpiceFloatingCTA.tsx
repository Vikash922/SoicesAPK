import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface SpiceFloatingCTAProps {
  label: string;
  price?: number;
  onPress: () => void;
  isVisible?: boolean;
}

export function SpiceFloatingCTA({ label, price, onPress, isVisible = true }: SpiceFloatingCTAProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const translateY = useSharedValue(100);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
    } else {
      translateY.value = withSpring(100, { damping: 15, stiffness: 200 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {price !== undefined && (
        <View style={styles.priceContainer}>
          <Text variant="caption" style={{ opacity: 0.7 }}>Total Amount</Text>
          <Text variant="price" family="price" style={styles.price}>₹{price}</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.saffron, flex: price !== undefined ? 1 : undefined, width: price === undefined ? '100%' : undefined }]} 
        onPress={onPress}
        activeOpacity={0.9}
        accessibilityRole="button"
      >
        <Text variant="h3" family="heading" style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 90,
  },
  priceContainer: {
    marginRight: 20,
  },
  price: {
    fontWeight: 'bold',
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});