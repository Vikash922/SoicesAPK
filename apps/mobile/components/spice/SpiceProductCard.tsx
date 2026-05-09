import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { Card } from '../ui/Card';
import { SpiceImage } from './SpiceImage';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedHeart } from '../ui/AnimatedHeart';
import { useFlyingCart } from '../ui/FlyingCartProvider';
import { MotiView } from 'moti';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SpiceProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  style?: any;
  variant?: 'grid' | 'list';
  layout?: string;
  onPress?: () => void;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
  index?: number;
}

export function SpiceProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  style,
  variant = 'grid',
  layout,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  index = 0,
}: SpiceProductCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { trigger } = useFlyingCart();
  const reducedMotion = useReducedMotion();

  const isList = variant === 'list';
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: any) => {
    if (onAddToCart) {
      onAddToCart();
      trigger(image, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 100 }}
      style={[styles.container, isList && styles.containerHorizontal, style]}
    >
      <Card style={{ flex: 1, padding: 0 }}>
        <TouchableOpacity 
          onPress={onPress} 
          activeOpacity={0.9} 
          style={isList ? styles.touchableHorizontal : {}}
          accessibilityLabel={`${name}, ${rating} stars, ₹${price}`}
          accessibilityRole="button"
          accessibilityHint="Goes to product detail page"
        >
          <View style={[styles.imageContainer, isList && styles.imageContainerHorizontal]}>
            <SpiceImage source={{ uri: image }} style={styles.image} />
            {discount > 0 && (
              <View style={[styles.discountBadge, { backgroundColor: colors.chili }]}>
                <Text style={styles.discountText}>{discount}% OFF</Text>
              </View>
            )}
          </View>

          <View style={[styles.content, isList && styles.contentHorizontal]}>
            <View style={{ backgroundColor: 'transparent' }}>
              <Text numberOfLines={2} variant="h3" family="heading" style={styles.name}>{name}</Text>
              
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.turmeric} />
                <Text variant="caption" style={styles.ratingText}>{rating}</Text>
              </View>
            </View>

            <View style={[styles.priceRow, isList && styles.priceRowHorizontal]}>
              <View style={styles.priceContainer}>
                <Text variant="price" family="price" style={styles.price}>₹{price}</Text>
                {originalPrice && (
                  <Text variant="strike" style={styles.originalPrice}>₹{originalPrice}</Text>
                )}
              </View>
              <View style={styles.actionButtons}>
                <View style={styles.wishlistButtonMinimal}>
                  <AnimatedHeart 
                    isLiked={isWishlisted} 
                    onPress={onToggleWishlist || (() => {})} 
                    size={24}
                    activeColor={colors.chili}
                    inactiveColor={colors.text}
                    accessibilityLabel={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: colors.saffron }]}
                  onPress={handleAddToCart}
                  accessibilityLabel={`Add ${name} to cart`}
                  accessibilityRole="button"
                >
                  <Ionicons name="cart-outline" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
  },
  containerHorizontal: {
    padding: 10,
  },
  touchableHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  imageContainerHorizontal: {
    width: 100,
    height: 100,
    aspectRatio: undefined,
  },
  image: {
    width: '100%',
    height: '100%',
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
  wishlistButtonMinimal: {
    marginRight: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  contentHorizontal: {
    flex: 1,
    marginTop: 0,
    marginLeft: 15,
    justifyContent: 'space-between',
    height: 100,
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
  priceRowHorizontal: {
    marginTop: 0,
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  addButton: {
    width: 44, // WCAG 44x44
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
