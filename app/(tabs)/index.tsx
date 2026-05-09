import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceProductCard } from '@/components/spice/SpiceProductCard';
import { SpiceCategoryCard } from '@/components/spice/SpiceCategoryCard';
import { ThreeDCarousel } from '@/components/spice/ThreeDCarousel';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp, FadeInDown, FadeInRight, useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { HomeHeader } from '@/components/ui/HomeHeader';
import { SpiceJarRefresh } from '@/components/ui/SpiceJarRefresh';
import { useCartStore } from '@/store/useCartStore';
import { FlipClock } from '@/components/ui/FlipClock';
import { FlashList } from '@shopify/flash-list';
import { useTrendingProducts, useCategories } from '@/hooks/useProducts';
import { SpiceShimmerLoader } from '@/components/spice/SpiceShimmerLoader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const CAROUSEL_ITEMS = [
  { 
    id: '1', 
    title: '40% OFF', 
    subtitle: 'on Premium Saffron', 
    image: 'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=300',
    backgroundColor: '#E2B714'
  },
  { 
    id: '2', 
    title: 'NEW ARRIVAL', 
    subtitle: 'Organic Spice Blends', 
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=300',
    backgroundColor: '#2E8B57'
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const addItem = useCartStore((state) => state.addItem);

  // Approximate header height: top inset + ~160px of content
  const headerHeight = useMemo(() => insets.top + 160, [insets.top]);

  const { data: trendingProducts, isLoading: isLoadingTrending } = useTrendingProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  useEffect(() => {
    router.prefetch('/explore');
    router.prefetch('/search/results');
    router.prefetch('/(tabs)/cart');
  }, [router]);

  const scrollY = useSharedValue(0);
  const refreshProgress = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    if (event.contentOffset.y < 0) {
      refreshProgress.value = Math.min(Math.abs(event.contentOffset.y) / 100, 1.2);
    } else {
      refreshProgress.value = 0;
    }
  });

  const renderProduct = useCallback(({ item, index }: any) => (
    <SpiceProductCard 
      id={item.id}
      name={item.name}
      image={item.image}
      price={item.price}
      originalPrice={item.original_price}
      rating={item.avg_rating || 0}
      isOutOfStock={item.is_out_of_stock}
      index={index}
      onPress={() => router.push(`/product/${item.id}`)}
      onAddToCart={() => addItem({ ...item, qty: 1 })}
    />
  ), [router, addItem]);

  const HeaderComponent = () => (
    <View style={{ backgroundColor: 'transparent' }}>
      <SpiceJarRefresh progress={refreshProgress} />

      {/* Flash Deal Header */}
      <Animated.View entering={FadeIn.delay(200)} style={styles.flashDealHeader}>
        <Text 
          variant="overline" 
          family="heading" 
          style={{ color: colors.chili, letterSpacing: 2, fontWeight: '700' }}
          accessibilityLabel="Flash Spice Deal active now"
        >
          🎉 FLASH SPICE DEAL 🎉
        </Text>
        <FlipClock />
      </Animated.View>

      {/* Hero Carousel */}
      <Animated.View entering={FadeIn.duration(1000)}>
        <ThreeDCarousel items={CAROUSEL_ITEMS} />
      </Animated.View>

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <Text 
          variant="overline" 
          family="badge" 
          style={styles.sectionTitle}
          accessibilityRole="header"
        >
          CATEGORIES
        </Text>
      </View>
      
      {isLoadingCategories ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {[1, 2, 3, 4].map((i) => (
            <SpiceShimmerLoader key={i} variant="card" style={{ width: 80, height: 100, marginRight: 15 }} />
          ))}
        </ScrollView>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesList}
          accessibilityRole="scrollbar"
          accessibilityLabel="Spice categories"
        >
          {categories?.map((category, i) => (
            <Animated.View key={category.id} entering={FadeInUp.delay(i * 100 + 400)}>
              <SpiceCategoryCard 
                id={category.id}
                label={category.name}
                icon={category.icon_url || 'leaf-outline'}
                color={category.color_hex || '#4A7C59'}
                onPress={() => router.push(`/category/${category.id}`)}
              />
            </Animated.View>
          ))}
        </ScrollView>
      )}

      {/* Trending Now */}
      <View style={styles.sectionHeader}>
        <Text variant="h2" family="heading" accessibilityRole="header">TRENDING NOW</Text>
        <TouchableOpacity 
          onPress={() => router.push('/explore')}
          accessibilityLabel="See all trending products"
          accessibilityRole="button"
        >
          <Text variant="body2" family="heading" style={{ color: colors.saffron }}>See All</Text>
        </TouchableOpacity>
      </View>

      {isLoadingTrending && (
        <View style={{ paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {[1, 2, 3, 4].map((i) => (
            <SpiceShimmerLoader key={i} variant="card" style={{ width: '48%', marginBottom: 15 }} />
          ))}
        </View>
      )}
    </View>
  );

  const FooterComponent = () => (
    <View style={{ backgroundColor: 'transparent' }}>
      {/* Recipe Pairings */}
      <View style={styles.sectionHeader}>
        <Text variant="h2" family="heading" accessibilityRole="header">RECIPE PAIRINGS</Text>
        <TouchableOpacity accessibilityLabel="See all recipe pairings"><Text variant="body2" style={{ color: colors.saffron }}>See All</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeList}>
         {[1, 2].map((id, i) => (
           <Animated.View key={id} entering={FadeInRight.delay(i * 200 + 600)}>
             <TouchableOpacity style={[styles.recipeCard, { backgroundColor: colors.card || '#fff' }]}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400' }} style={styles.recipeImg} />
                <View style={styles.recipeContent}>
                  <Text variant="body1" family="heading">Kashmiri Biryani</Text>
                  <Text variant="caption" style={{ opacity: 0.6 }}>Essential: Saffron, Cardamom</Text>
                  <TouchableOpacity style={[styles.recipeBtn, { backgroundColor: colors.saffron }]}>
                    <Text variant="overline" family="badge" style={{ color: '#000' }}>GET ALL SPICES</Text>
                  </TouchableOpacity>
                </View>
             </TouchableOpacity>
           </Animated.View>
         ))}
      </ScrollView>

      {/* Combo Packs */}
      <View style={styles.sectionHeader}>
        <Text variant="h2" family="heading" accessibilityRole="header">COMBO PACKS</Text>
        <TouchableOpacity accessibilityLabel="See all combo packs"><Text variant="body2" style={{ color: colors.saffron }}>See All</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeList}>
         {[1, 2].map((id, i) => (
           <Animated.View key={id} entering={FadeInRight.delay(i * 200 + 1000)}>
             <TouchableOpacity style={[styles.comboCard, { backgroundColor: colors.card || '#fff' }]}>
                <View style={[styles.comboBadge, { backgroundColor: colors.chili }]}>
                  <Text variant="overline" style={{ color: '#fff', fontSize: 8 }}>SAVE 20%</Text>
                </View>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400' }} style={styles.comboImg} />
                <View style={styles.comboContent}>
                  <Text variant="body2" family="heading">Essential Spice Kit</Text>
                  <Text variant="price" family="price" style={{ color: colors.saffron, fontSize: 16 }}>₹899</Text>
                </View>
             </TouchableOpacity>
           </Animated.View>
         ))}
      </ScrollView>

      <View style={{ height: 120 }} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerWrapper}>
        <HomeHeader />
      </View>

      <AnimatedFlashList
        data={trendingProducts || []}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        estimatedItemSize={250}
        ListHeaderComponent={HeaderComponent}
        ListFooterComponent={FooterComponent}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.flashListContent, 
          { paddingTop: headerHeight }
        ]}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  flashListContent: { 
    paddingHorizontal: 5,
  },
  flashDealHeader: { 
    alignItems: 'center', 
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 15 },
  sectionTitle: { opacity: 0.5, letterSpacing: 1.5 },
  categoriesList: { paddingLeft: 15, marginBottom: 25 },
  recipeList: { paddingLeft: 15, marginBottom: 25 },
  recipeCard: { width: 280, borderRadius: 20, overflow: 'hidden', marginRight: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  recipeImg: { width: '100%', height: 140 },
  recipeContent: { padding: 15, backgroundColor: 'transparent' },
  recipeBtn: { marginTop: 10, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  comboCard: { width: 160, borderRadius: 16, overflow: 'hidden', marginRight: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  comboBadge: { position: 'absolute', top: 10, left: 10, zIndex: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  comboImg: { width: '100%', height: 120 },
  comboContent: { padding: 12, backgroundColor: 'transparent' },
});
