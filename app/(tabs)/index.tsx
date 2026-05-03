import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceProductCard } from '@/components/spice/SpiceProductCard';
import { SpiceCategoryCard } from '@/components/spice/SpiceCategoryCard';
import { SpiceCarousel } from '@/components/spice/SpiceCarousel';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

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

const CATEGORIES = [
  { id: '1', name: 'Whole Spices', icon: 'leaf-outline', color: '#4A7C59' },
  { id: '2', name: 'Ground Spices', icon: 'color-filter-outline', color: '#E8590C' },
  { id: '3', name: 'Masalas', icon: 'restaurant-outline', color: '#8B4513' },
  { id: '4', name: 'Exotic', icon: 'diamond-outline', color: '#6A5ACD' },
  { id: '5', name: 'Organic', icon: 'ribbon-outline', color: '#2E8B57' },
];

const TRENDING_PRODUCTS = [
  { id: '1', name: 'Kashmiri Saffron (1g)', image: 'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=400', price: 499, originalPrice: 699, rating: 4.8 },
  { id: '2', name: 'Turmeric Powder (200g)', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=400', price: 129, originalPrice: 159, rating: 4.5 },
  { id: '3', name: 'Black Pepper (100g)', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400', price: 189, originalPrice: 229, rating: 4.7 },
  { id: '4', name: 'Green Cardamom (50g)', image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400', price: 249, originalPrice: 299, rating: 4.9 },
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.background }]}>
        <View style={styles.topRow}>
          <Text variant="h2" family="display" style={{ color: colors.saffron }}>SpiceCart</Text>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
              <View style={[styles.badge, { backgroundColor: colors.chili }]} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.searchBar, { backgroundColor: colorScheme === 'light' ? '#fff' : colors.card || '#16213E' }]}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search-outline" size={20} color={colors.tabIconDefault} />
          <Text variant="body2" style={[styles.searchPlaceholder, { color: colors.tabIconDefault, marginLeft: 10 }]}>
            Search spices...
          </Text>
        </TouchableOpacity>

        <View style={styles.locationBar}>
          <Ionicons name="location-outline" size={16} color={colors.saffron} />
          <Text variant="caption" style={styles.locationText}>Delivering to Mumbai v</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Carousel */}
        <Animated.View entering={FadeIn.duration(1000)}>
          <SpiceCarousel items={CAROUSEL_ITEMS} />
        </Animated.View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text variant="overline" family="badge" style={styles.sectionTitle}>CATEGORIES</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {CATEGORIES.map((category, i) => (
            <Animated.View key={category.id} entering={FadeInUp.delay(i * 100)}>
              <SpiceCategoryCard 
                {...category} 
                onPress={() => router.push(`/category/${category.id}`)}
              />
            </Animated.View>
          ))}
        </ScrollView>

        {/* Trending Now */}
        <View style={styles.sectionHeader}>
          <Text variant="h2" family="heading">TRENDING NOW</Text>
          <TouchableOpacity onPress={() => router.push('/explore')}>
            <Text variant="body2" family="heading" style={{ color: colors.saffron }}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {TRENDING_PRODUCTS.map((product, i) => (
            <Animated.View key={product.id} entering={FadeInDown.delay(i * 150)} style={styles.gridItem}>
              <SpiceProductCard 
                {...product} 
                onPress={() => router.push(`/product/${product.id}`)}
              />
            </Animated.View>
          ))}
        </View>

        {/* Recipe Pairings */}
        <View style={styles.sectionHeader}>
          <Text variant="h2" family="heading">RECIPE PAIRINGS</Text>
          <TouchableOpacity><Text variant="body2" style={{ color: colors.saffron }}>See All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeList}>
           {[1, 2].map((id) => (
             <TouchableOpacity key={id} style={[styles.recipeCard, { backgroundColor: colors.card || '#fff' }]}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400' }} style={styles.recipeImg} />
                <View style={styles.recipeContent}>
                  <Text variant="body1" family="heading">Kashmiri Biryani</Text>
                  <Text variant="caption" style={{ opacity: 0.6 }}>Essential: Saffron, Cardamom</Text>
                  <TouchableOpacity style={[styles.recipeBtn, { backgroundColor: colors.saffron }]}>
                    <Text variant="overline" family="badge" style={{ color: '#000' }}>GET ALL SPICES</Text>
                  </TouchableOpacity>
                </View>
             </TouchableOpacity>
           ))}
        </ScrollView>

        {/* Combo Packs */}
        <View style={styles.sectionHeader}>
          <Text variant="h2" family="heading">COMBO PACKS</Text>
          <TouchableOpacity><Text variant="body2" style={{ color: colors.saffron }}>See All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeList}>
           {[1, 2].map((id) => (
             <TouchableOpacity key={id} style={[styles.comboCard, { backgroundColor: colors.card || '#fff' }]}>
                <View style={[styles.comboBadge, { backgroundColor: colors.chili }]}>
                  <Text variant="overline" style={{ color: '#fff', fontSize: 8 }}>SAVE 20%</Text>
                </View>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400' }} style={styles.comboImg} />
                <View style={styles.comboContent}>
                  <Text variant="body2" family="heading">Essential Spice Kit</Text>
                  <Text variant="price" family="price" style={{ color: colors.saffron, fontSize: 16 }}>₹899</Text>
                </View>
             </TouchableOpacity>
           ))}
        </ScrollView>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15, zIndex: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  topActions: { flexDirection: 'row' },
  iconBtn: { padding: 8 },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 48, borderRadius: 12, marginBottom: 10 },
  searchPlaceholder: { fontSize: 14 },
  locationBar: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 4, opacity: 0.6 },
  scrollContent: { paddingTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { opacity: 0.5, letterSpacing: 1.5 },
  categoriesList: { paddingLeft: 20, marginBottom: 25 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, marginBottom: 25 },
  gridItem: { width: '50%', padding: 5 },
  recipeList: { paddingLeft: 20, marginBottom: 25 },
  recipeCard: { width: 280, borderRadius: 20, overflow: 'hidden', marginRight: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  recipeImg: { width: '100%', height: 140 },
  recipeContent: { padding: 15 },
  recipeBtn: { marginTop: 10, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  comboCard: { width: 160, borderRadius: 16, overflow: 'hidden', marginRight: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  comboBadge: { position: 'absolute', top: 10, left: 10, zIndex: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  comboImg: { width: '100%', height: 120 },
  comboContent: { padding: 12 },
});
