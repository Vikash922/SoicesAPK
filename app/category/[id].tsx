import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceProductCard } from '@/components/spice/SpiceProductCard';
import Animated, { 
  FadeInUp, 
  Layout, 
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CATEGORIES_DATA = {
  '1': { name: 'Whole Spices', color: '#4A7C59' },
  '2': { name: 'Ground Spices', color: '#E8590C' },
  '3': { name: 'Masalas', color: '#8B4513' },
  '4': { name: 'Exotic', color: '#6A5ACD' },
  '5': { name: 'Organic', color: '#2E8B57' },
};

const FILTER_CHIPS = [
  'All', 'Premium', 'Organic', 'Price: Low-High', 'Rating: 4+', 'Heat: Mild', 'In Stock'
];

const MOCK_PRODUCTS = [
  { id: '1', name: 'Black Peppercorns', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400', price: 189, originalPrice: 229, rating: 4.7 },
  { id: '2', name: 'Green Cardamom Pods', image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400', price: 249, originalPrice: 299, rating: 4.9 },
  { id: '3', name: 'Cinnamon Sticks', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400', price: 89, originalPrice: 110, rating: 4.6 },
  { id: '4', name: 'Star Anise', image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400', price: 145, rating: 4.4 },
  { id: '5', name: 'Cloves (Laving)', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400', price: 175, rating: 4.8 },
  { id: '6', name: 'Nutmeg Whole', image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400', price: 210, originalPrice: 250, rating: 4.5 },
];

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const category = CATEGORIES_DATA[id as keyof typeof CATEGORIES_DATA] || { name: 'Category', color: colors.saffron };

  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All']);
  const [isGridView, setIsGridView] = useState(true);

  const toggleFilter = (filter: string) => {
    if (filter === 'All') {
      setSelectedFilters(['All']);
      return;
    }
    setSelectedFilters(prev => {
      const filtered = prev.filter(f => f !== 'All');
      return filtered.includes(filter) 
        ? (filtered.length === 1 ? ['All'] : filtered.filter(f => f !== filter)) 
        : [...filtered, filter];
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: category.name,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/search')} style={styles.headerBtn}>
              <Ionicons name="search-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {FILTER_CHIPS.map((filter) => (
            <FilterChip 
              key={filter} 
              label={filter} 
              isSelected={selectedFilters.includes(filter)}
              onPress={() => toggleFilter(filter)}
              colors={colors}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text variant="body2" family="heading" style={{ opacity: 0.6 }}>
          Showing {MOCK_PRODUCTS.length} items
        </Text>
        <View style={styles.headerActions}>
           <TouchableOpacity style={styles.sortBtn}>
              <Ionicons name="swap-vertical-outline" size={18} color={colors.text} />
              <Text variant="caption" family="heading" style={{ marginLeft: 6 }}>SORT</Text>
           </TouchableOpacity>
           <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '40' }]} />
           <TouchableOpacity onPress={() => setIsGridView(!isGridView)} style={styles.viewToggle}>
             <Ionicons name={isGridView ? "list-outline" : "grid-outline"} size={22} color={colors.text} />
           </TouchableOpacity>
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={MOCK_PRODUCTS}
        key={isGridView ? 'grid' : 'list'}
        numColumns={isGridView ? 2 : 1}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultsList}
        renderItem={({ item, index }) => (
          <Animated.View 
            layout={Layout.springify()}
            entering={FadeInUp.delay(index * 100)}
            style={isGridView ? styles.gridItem : styles.listItem}
          >
            <SpiceProductCard 
              {...item} 
              onPress={() => router.push(`/product/${item.id}`)}
              style={isGridView ? { width: '100%' } : styles.listCard}
            />
          </Animated.View>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
}

function FilterChip({ label, isSelected, onPress, colors }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: isSelected ? colors.saffron : 'transparent',
    borderColor: isSelected ? colors.saffron : colors.tabIconDefault + '40',
  }));

  const handlePress = () => {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.chip, animatedStyle]}>
        <Text 
          variant="caption" 
          family="heading" 
          style={{ color: isSelected ? '#000' : colors.text, opacity: isSelected ? 1 : 0.7 }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBtn: { padding: 10 },
  filterSection: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  filterList: { paddingLeft: 20 },
  chip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1, 
    marginRight: 10 
  },
  resultsHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  sortBtn: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  viewToggle: { padding: 5 },
  divider: { width: 1, height: 20, marginHorizontal: 10 },
  resultsList: { paddingHorizontal: 10 },
  gridItem: { width: '50%', padding: 5 },
  listItem: { width: '100%', padding: 5 },
  listCard: { width: '100%' }
});
