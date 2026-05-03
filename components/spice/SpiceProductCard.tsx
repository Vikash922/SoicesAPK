import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { Card } from '../ui/Card';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedHeart } from '../ui/AnimatedHeart';

interface SpiceProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  onPress?: () => void;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
}

export function SpiceProductCard({
  name,
  image,
  price,
  originalPrice,
  rating,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: SpiceProductCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          {discount > 0 && (
            <View style={[styles.discountBadge, { backgroundColor: colors.chili }]}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
          <View style={styles.wishlistButton}>
            <AnimatedHeart 
              isLiked={isWishlisted} 
              onPress={onToggleWishlist || (() => {})} 
              size={18}
              activeColor={colors.chili}
              inactiveColor={colors.text}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} variant="h3" family="heading" style={styles.name}>{name}</Text>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.turmeric} />
            <Text variant="caption" style={styles.ratingText}>{rating}</Text>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              <Text variant="price" family="price" style={styles.price}>₹{price}</Text>
              {originalPrice && (
                <Text variant="strike" style={styles.originalPrice}>₹{originalPrice}</Text>
              )}
            </View>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.saffron }]}
              onPress={onAddToCart}
            >
              <Ionicons name="cart-outline" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  name: {
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  ratingText: {
    marginLeft: 4,
    opacity: 0.7,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'transparent',
  },
  price: {
    fontWeight: 'bold',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 4,
    opacity: 0.5,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
