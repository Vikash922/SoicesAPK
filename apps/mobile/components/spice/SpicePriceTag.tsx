import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface SpicePriceTagProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  style?: any;
}

function CounterText({ value, style }: { value: number, style?: any }) {
  const prevValue = useRef(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    
    let start = prevValue.current;
    const end = value;
    const duration = 400;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
    prevValue.current = value;
  }, [value]);

  return <Text style={style}>₹{displayValue.toLocaleString()}</Text>;
}

export function SpicePriceTag({ price, originalPrice, discount, style }: SpicePriceTagProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Smart rounding logic
  const roundedPrice = Math.round(price);
  const roundedOriginal = originalPrice ? Math.round(originalPrice) : undefined;
  
  // Calculate discount if not provided but original price is
  const calculatedDiscount = discount ?? (roundedOriginal ? Math.round(((roundedOriginal - roundedPrice) / roundedOriginal) * 100) : 0);

  return (
    <View style={[styles.container, style]}>
      <CounterText value={roundedPrice} style={[styles.price, { color: colors.saffron }]} />
      {roundedOriginal && roundedOriginal > roundedPrice && (
        <View style={styles.originalContainer}>
          <Text variant="strike" style={styles.originalPrice}>₹{roundedOriginal.toLocaleString()}</Text>
          {calculatedDiscount > 0 && (
            <View style={[styles.discountBadge, { backgroundColor: colors.chili }]}>
              <Text style={styles.discountText}>{calculatedDiscount}% OFF</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'DM Sans', // Using the defined price font family if it exists in theme, else fallback
  },
  originalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
    marginRight: 6,
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
