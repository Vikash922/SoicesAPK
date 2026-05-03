import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, View as DefaultView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { AnimatedHeart } from '@/components/ui/AnimatedHeart';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

const { width } = Dimensions.get('window');

const PRODUCT_MOCK = {
  id: '1',
  name: 'Kashmiri Saffron (Premium)',
  brand: 'SpiceCart Select',
  rating: 4.8,
  reviewCount: 2847,
  price: 499,
  originalPrice: 699,
  origin: 'Kashmir, India',
  heatLevel: 2, // 1-10 scale
  description: 'Hand-picked from the fields of Pampore, our Kashmiri Saffron is world-renowned for its deep red color, strong aroma, and superior flavor. Each thread is carefully selected to ensure the highest quality.',
  images: [
    'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=800',
    'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=800',
  ],
  variants: ['1g', '2g', '5g', '10g'],
  nutrition: [
    { label: 'Calories', value: '310 kcal' },
    { label: 'Fiber', value: '3.9g' },
    { label: 'Iron', value: '11.1mg' },
    { label: 'Vit A', value: '530 IU' },
  ],
  recipes: [
    { id: '1', name: 'Saffron Rice', image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=300' },
    { id: '2', name: 'Kashmiri Kahwa', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300' },
  ]
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedVariant, setSelectedVariant] = React.useState('1g');

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(PRODUCT_MOCK.id));

  // Heat Meter Animation
  const heatProgress = useSharedValue(0);

  useEffect(() => {
    heatProgress.value = withTiming(PRODUCT_MOCK.heatLevel / 10, { duration: 1500 });
  }, []);

  const heatIndicatorStyle = useAnimatedStyle(() => ({
    left: `${heatProgress.value * 100}%`,
  }));

  const handleAddToCart = () => {
    addItem({
      id: PRODUCT_MOCK.id,
      name: PRODUCT_MOCK.name,
      image: PRODUCT_MOCK.images[0],
      price: PRODUCT_MOCK.price,
      qty: 1,
      variant: selectedVariant
    });
    router.push('/(tabs)/cart');
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: PRODUCT_MOCK.id,
      name: PRODUCT_MOCK.name,
      image: PRODUCT_MOCK.images[0],
      price: PRODUCT_MOCK.price,
      rating: PRODUCT_MOCK.rating
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerTitle: 'Product Details',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center' }}>
              <View style={[styles.headerButton, { width: 44, height: 44 }]}>
                <AnimatedHeart 
                  isLiked={isInWishlist} 
                  onPress={handleWishlist} 
                  size={24}
                  activeColor={colors.chili}
                  inactiveColor={colors.text}
                />
              </View>
              <TouchableOpacity style={[styles.headerButton, { marginLeft: 12 }]}>
                <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {PRODUCT_MOCK.images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.heroImage} />
          ))}
        </ScrollView>

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: colors.cardamom + '20' }]}>
              <Ionicons name="leaf-outline" size={14} color={colors.cardamom} />
              <Text variant="overline" family="badge" style={{ color: colors.cardamom, marginLeft: 4 }}>ORGANIC</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.saffron + '20', marginLeft: 8 }]}>
              <Ionicons name="ribbon-outline" size={14} color={colors.saffron} />
              <Text variant="overline" family="badge" style={{ color: colors.saffron, marginLeft: 4 }}>PREMIUM</Text>
            </View>
          </View>

          <Text variant="h1" family="heading" style={styles.name}>{PRODUCT_MOCK.name}</Text>
          <Text variant="body2" style={styles.brand}>by {PRODUCT_MOCK.brand}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.turmeric} />
            <Text variant="body2" family="heading" style={{ marginLeft: 4 }}>{PRODUCT_MOCK.rating}</Text>
            <Text variant="caption" style={{ opacity: 0.5, marginLeft: 4 }}>({PRODUCT_MOCK.reviewCount} reviews)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text variant="display2" family="price">₹{PRODUCT_MOCK.price}</Text>
            <Text variant="body1" style={styles.originalPrice}>₹{PRODUCT_MOCK.originalPrice}</Text>
            <View style={[styles.discountBadge, { backgroundColor: colors.chili }]}>
              <Text variant="overline" family="badge" style={{ color: '#fff' }}>30% OFF</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Spice Heat Meter */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text variant="body2" family="heading">SPICE HEAT METER</Text>
              <Text variant="body2" style={{ color: colors.chili }}>{PRODUCT_MOCK.heatLevel}/10</Text>
            </View>
            <View style={styles.heatMeterContainer}>
              <LinearGradient
                colors={['#2E8B57', '#F4C430', '#C41E3A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heatBar}
              />
              <Animated.View style={[styles.heatIndicator, heatIndicatorStyle]}>
                 <Ionicons name="caret-up" size={16} color={colors.text} />
              </Animated.View>
            </View>
            <View style={styles.heatLabels}>
               <Text variant="overline">Mild</Text>
               <Text variant="overline">Medium</Text>
               <Text variant="overline">Hot</Text>
            </View>
          </View>

          {/* Variants */}
          <View style={styles.section}>
            <Text variant="body2" family="heading" style={styles.sectionTitle}>SELECT SIZE</Text>
            <View style={styles.variantContainer}>
              {PRODUCT_MOCK.variants.map((v) => (
                <TouchableOpacity 
                  key={v} 
                  onPress={() => setSelectedVariant(v)}
                  style={[
                    styles.variantPill, 
                    { backgroundColor: selectedVariant === v ? colors.saffron : 'transparent', borderColor: colors.saffron }
                  ]}
                >
                  <Text variant="body2" family="heading" style={{ color: selectedVariant === v ? '#000' : colors.saffron }}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Origin & Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color={colors.saffron} />
              <Text variant="caption" style={styles.infoLabel}>Origin</Text>
              <Text variant="body2" family="heading">{PRODUCT_MOCK.origin}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.cardamom} />
              <Text variant="caption" style={styles.infoLabel}>Authentic</Text>
              <Text variant="body2" family="heading">100% Pure</Text>
            </View>
          </View>

          {/* Nutrition Section */}
          <View style={[styles.section, styles.nutritionSection, { backgroundColor: colors.card + '30' }]}>
             <Text variant="body2" family="heading" style={styles.sectionTitle}>NUTRITION FACTS (per 100g)</Text>
             <View style={styles.nutritionGrid}>
                {PRODUCT_MOCK.nutrition.map((item) => (
                  <View key={item.label} style={styles.nutritionItem}>
                     <Text variant="caption" style={{ opacity: 0.6 }}>{item.label}</Text>
                     <Text variant="body2" family="heading">{item.value}</Text>
                  </View>
                ))}
             </View>
          </View>

          <View style={styles.section}>
            <Text variant="body2" family="heading" style={styles.sectionTitle}>DESCRIPTION</Text>
            <Text variant="body2" style={styles.description}>{PRODUCT_MOCK.description}</Text>
          </View>

          {/* Recipe Pairings */}
          <View style={styles.section}>
            <Text variant="body2" family="heading" style={styles.sectionTitle}>RECIPES USING THIS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeList}>
              {PRODUCT_MOCK.recipes.map((recipe) => (
                <TouchableOpacity key={recipe.id} style={styles.recipeCard} onPress={() => router.push(`/recipe/${recipe.id}`)}>
                  <Image source={{ uri: recipe.image }} style={styles.recipeImg} />
                  <Text variant="caption" family="heading" style={styles.recipeName}>{recipe.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.stickyBottom, { backgroundColor: colors.background, borderTopColor: colors.tabIconDefault + '30' }]}>
        <View style={[styles.wishlistBtn, { borderColor: colors.tabIconDefault }]}>
          <AnimatedHeart 
            isLiked={isInWishlist} 
            onPress={handleWishlist} 
            size={24}
            activeColor={colors.chili}
            inactiveColor={colors.text}
          />
        </View>
        <Button 
          title={`ADD TO CART • ₹${PRODUCT_MOCK.price}`} 
          onPress={handleAddToCart} 
          style={styles.addToCartBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' },
  heroImage: { width: width, height: width, resizeMode: 'cover' },
  content: { padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
  badgeRow: { flexDirection: 'row', marginBottom: 16, backgroundColor: 'transparent' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  name: { marginBottom: 4 },
  brand: { opacity: 0.6, marginBottom: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: 'transparent' },
  priceRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
  originalPrice: { textDecorationLine: 'line-through', opacity: 0.4, marginHorizontal: 12 },
  discountBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 24 },
  section: { marginBottom: 24, backgroundColor: 'transparent' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { marginBottom: 12, opacity: 0.8 },
  heatMeterContainer: { height: 8, width: '100%', backgroundColor: '#eee', borderRadius: 4, position: 'relative' },
  heatBar: { ...StyleSheet.absoluteFillObject, borderRadius: 4 },
  heatIndicator: { position: 'absolute', top: 4, width: 16, marginLeft: -8, alignItems: 'center' },
  heatLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  variantContainer: { flexDirection: 'row', backgroundColor: 'transparent' },
  variantPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginRight: 12 },
  infoGrid: { flexDirection: 'row', marginBottom: 24, backgroundColor: 'transparent' },
  infoItem: { flex: 1, backgroundColor: 'transparent' },
  infoLabel: { opacity: 0.5, marginTop: 4 },
  nutritionSection: { padding: 16, borderRadius: 16 },
  nutritionGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  nutritionItem: { width: '50%', marginBottom: 12 },
  description: { lineHeight: 22, opacity: 0.8 },
  recipeList: { backgroundColor: 'transparent' },
  recipeCard: { width: 120, marginRight: 16 },
  recipeImg: { width: 120, height: 120, borderRadius: 12, marginBottom: 8 },
  recipeName: { textAlign: 'center' },
  stickyBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 40, flexDirection: 'row', borderTopWidth: 1 },
  wishlistBtn: { width: 56, height: 56, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  addToCartBtn: { flex: 1, height: 56 },
});
