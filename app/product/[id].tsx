import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, View as DefaultView, ActivityIndicator } from 'react-native';
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
import { useProduct, useReviews, useCommunityRecipes } from '@/hooks/useProducts';
import { SpiceShimmerLoader } from '@/components/spice/SpiceShimmerLoader';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedVariant, setSelectedVariant] = React.useState('100g');

  const { data: product, isLoading } = useProduct(id as string);
  const { data: reviews, isLoading: isLoadingReviews } = useReviews(id as string);
  const { data: communityRecipes, isLoading: isLoadingRecipes } = useCommunityRecipes(id as string);
  
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id as string));

  // Heat Meter Animation
  const heatProgress = useSharedValue(0);

  useEffect(() => {
    if (product) {
      heatProgress.value = withTiming((product.spice_heat_level || 0) / 10, { duration: 1500 });
    }
  }, [product]);

  const heatIndicatorStyle = useAnimatedStyle(() => ({
    left: `${heatProgress.value * 100}%`,
  }));

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SpiceShimmerLoader variant="banner" style={{ height: width, width: width }} />
        <View style={{ padding: 20 }}>
          <SpiceShimmerLoader variant="list" />
          <SpiceShimmerLoader variant="list" />
          <SpiceShimmerLoader variant="list" />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
        <Text>Product not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const discount = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
      variant: selectedVariant
    });
    router.push('/(tabs)/cart');
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      rating: product.avg_rating
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerTitle: product.name,
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
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.heroImage} />
          ))}
        </ScrollView>

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            {product.is_organic && (
              <View style={[styles.badge, { backgroundColor: colors.cardamom + '20' }]}>
                <Ionicons name="leaf-outline" size={14} color={colors.cardamom} />
                <Text variant="overline" family="badge" style={{ color: colors.cardamom, marginLeft: 4 }}>ORGANIC</Text>
              </View>
            )}
            {product.is_premium && (
              <View style={[styles.badge, { backgroundColor: colors.saffron + '20', marginLeft: 8 }]}>
                <Ionicons name="ribbon-outline" size={14} color={colors.saffron} />
                <Text variant="overline" family="badge" style={{ color: colors.saffron, marginLeft: 4 }}>PREMIUM</Text>
              </View>
            )}
          </View>

          <Text variant="h1" family="heading" style={styles.name}>{product.name}</Text>
          <Text variant="body2" style={styles.brand}>SpiceCart Premium Collection</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.turmeric} />
            <Text variant="body2" family="heading" style={{ marginLeft: 4 }}>{product.avg_rating || 0}</Text>
            <Text variant="caption" style={{ opacity: 0.5, marginLeft: 4 }}>({product.review_count || 0} reviews)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text variant="display2" family="price">₹{product.price}</Text>
            {product.original_price && (
              <>
                <Text variant="body1" style={styles.originalPrice}>₹{product.original_price}</Text>
                <View style={[styles.discountBadge, { backgroundColor: colors.chili }]}>
                  <Text variant="overline" family="badge" style={{ color: '#fff' }}>{discount}% OFF</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.divider} />

          {/* Spice Heat Meter */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text variant="body2" family="heading">SPICE HEAT METER</Text>
              <Text variant="body2" style={{ color: colors.chili }}>{product.spice_heat_level}/10</Text>
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
              {['50g', '100g', '250g', '500g'].map((v) => (
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
              <Text variant="body2" family="heading">{product.origin_country}{product.region ? `, ${product.region}` : ''}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.cardamom} />
              <Text variant="caption" style={styles.infoLabel}>Authentic</Text>
              <Text variant="body2" family="heading">100% Pure</Text>
            </View>
          </View>

          {/* Nutrition Section */}
          {product.nutrition_info && product.nutrition_info.length > 0 && (
            <View style={[styles.section, styles.nutritionSection, { backgroundColor: colors.card + '30' }]}>
               <Text variant="body2" family="heading" style={styles.sectionTitle}>NUTRITION FACTS (per 100g)</Text>
               <View style={styles.nutritionGrid}>
                  {product.nutrition_info.map((item) => (
                    <View key={item.label} style={styles.nutritionItem}>
                       <Text variant="caption" style={{ opacity: 0.6 }}>{item.label}</Text>
                       <Text variant="body2" family="heading">{item.value}</Text>
                    </View>
                  ))}
               </View>
            </View>
          )}

          <View style={styles.section}>
            <Text variant="body2" family="heading" style={styles.sectionTitle}>DESCRIPTION</Text>
            <Text variant="body2" style={styles.description}>{product.description}</Text>
          </View>

          {product.storage_tips && (
            <View style={styles.section}>
              <Text variant="body2" family="heading" style={styles.sectionTitle}>STORAGE TIPS</Text>
              <Text variant="body2" style={styles.description}>{product.storage_tips}</Text>
            </View>
          )}

          {/* Community Recipes */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text variant="body2" family="heading" style={styles.sectionTitle}>COMMUNITY RECIPES</Text>
              <TouchableOpacity><Text variant="caption" style={{ color: colors.saffron }}>View All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
              {isLoadingRecipes ? (
                [1,2].map(i => <SpiceShimmerLoader key={i} variant="card" style={{ width: 140, height: 140, marginRight: 15 }} />)
              ) : communityRecipes && communityRecipes.length > 0 ? (
                communityRecipes.map((recipe) => (
                  <View key={recipe.id} style={styles.communityCard}>
                    <Image source={{ uri: recipe.image_url }} style={styles.communityImg} />
                    <View style={[styles.communityUserRow, { backgroundColor: 'transparent' }]}>
                      <Image source={{ uri: recipe.profiles?.avatar_url }} style={styles.communityAvatar} />
                      <Text variant="caption" family="heading" style={{ marginLeft: 6, color: '#fff' }}>{recipe.profiles?.full_name.split(' ')[0]}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text variant="caption" style={{ opacity: 0.5, marginVertical: 20 }}>Be the first to share a recipe!</Text>
              )}
              <TouchableOpacity style={[styles.addRecipeCard, { borderColor: colors.tabIconDefault + '40', borderStyle: 'dashed', borderWidth: 1 }]}>
                <Ionicons name="camera-outline" size={24} color={colors.saffron} />
                <Text variant="caption" style={{ marginTop: 8, color: colors.saffron, textAlign: 'center' }}>Share your{'\n'}creation</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Ratings & Reviews */}
          <View style={styles.section}>
            <Text variant="body2" family="heading" style={styles.sectionTitle}>RATINGS & REVIEWS</Text>
            
            <View style={styles.ratingSummary}>
              <View style={styles.ratingSummaryLeft}>
                <Text variant="display1" family="heading">{product.avg_rating || '0.0'}</Text>
                <View style={{ flexDirection: 'row', marginVertical: 4, backgroundColor: 'transparent' }}>
                  {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={14} color={i <= Math.round(product.avg_rating || 0) ? colors.turmeric : colors.tabIconDefault + '44'} />)}
                </View>
                <Text variant="caption" style={{ opacity: 0.6 }}>{product.review_count || '0'} Reviews</Text>
              </View>
              
              <View style={styles.ratingBars}>
                {[5, 4, 3, 2, 1].map((star, i) => {
                  const percent = product.review_count ? Math.random() * 100 : 0;
                  return (
                    <View key={star} style={styles.ratingBarRow}>
                      <Text variant="caption" style={styles.starText}>{star} <Ionicons name="star" size={10} /></Text>
                      <View style={[styles.ratingBarBg, { backgroundColor: colors.tabIconDefault + '20' }]}>
                        <View style={[styles.ratingBarFill, { width: `${percent}%`, backgroundColor: colors.turmeric }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {isLoadingReviews ? (
              <ActivityIndicator color={colors.saffron} />
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Image source={{ uri: review.profiles?.avatar_url }} style={styles.reviewerAvatar} />
                    <View style={{ marginLeft: 10 }}>
                      <Text variant="body2" family="heading">{review.profiles?.full_name}</Text>
                      <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                        {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={10} color={i <= review.rating ? colors.turmeric : colors.tabIconDefault + '44'} />)}
                      </View>
                    </View>
                    <Text variant="caption" style={{ marginLeft: 'auto', opacity: 0.5 }}>{new Date(review.created_at).toLocaleDateString()}</Text>
                  </View>
                  <Text variant="body2" style={{ opacity: 0.8, lineHeight: 20 }}>{review.comment}</Text>
                </View>
              ))
            ) : (
              <Text variant="caption" style={{ opacity: 0.5, textAlign: 'center', marginVertical: 20 }}>No reviews yet.</Text>
            )}

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
          title={product.is_out_of_stock ? "OUT OF STOCK" : `ADD TO CART • ₹${product.price}`} 
          onPress={handleAddToCart} 
          style={styles.addToCartBtn}
          disabled={product.is_out_of_stock}
          variant={product.is_out_of_stock ? "outline" : "primary"}
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
  communityCard: { width: 140, marginRight: 15, borderRadius: 16, overflow: 'hidden' },
  communityImg: { width: 140, height: 140, borderRadius: 16 },
  communityUserRow: { position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', alignItems: 'center' },
  communityAvatar: { width: 20, height: 20, borderRadius: 10 },
  addRecipeCard: { width: 140, height: 140, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  ratingSummary: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: 'transparent' },
  ratingSummaryLeft: { alignItems: 'center', marginRight: 20, backgroundColor: 'transparent' },
  ratingBars: { flex: 1, backgroundColor: 'transparent' },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, backgroundColor: 'transparent' },
  starText: { width: 20, fontSize: 10, opacity: 0.6 },
  ratingBarBg: { flex: 1, height: 6, borderRadius: 3, marginLeft: 8 },
  ratingBarFill: { height: '100%', borderRadius: 3 },
  reviewItem: { marginBottom: 20, backgroundColor: 'transparent' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: 'transparent' },
  reviewerAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stickyBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 40, flexDirection: 'row', borderTopWidth: 1 },
  wishlistBtn: { width: 56, height: 56, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  addToCartBtn: { flex: 1, height: 56 },
});
