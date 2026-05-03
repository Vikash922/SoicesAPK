import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceProductCard } from '@/components/spice/SpiceProductCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const FILTERS = [
  'All', 'Whole', 'Ground', 'Organic', 'Masalas', 'Herbs', 'Exotic'
];

const PRODUCTS = [
  { id: '1', name: 'Kashmiri Saffron (1g)', image: 'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=400', price: 499, originalPrice: 699, rating: 4.8 },
  { id: '2', name: 'Turmeric Powder (200g)', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=400', price: 129, originalPrice: 159, rating: 4.5 },
  { id: '3', name: 'Black Pepper (100g)', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400', price: 189, originalPrice: 229, rating: 4.7 },
  { id: '4', name: 'Green Cardamom (50g)', image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400', price: 249, originalPrice: 299, rating: 4.9 },
  { id: '5', name: 'Cloves (50g)', image: 'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=400', price: 89, originalPrice: 119, rating: 4.6 },
  { id: '6', name: 'Cinnamon Sticks (100g)', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400', price: 149, originalPrice: 199, rating: 4.8 },
];

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text variant="h1" family="heading">Explore</Text>
        <TouchableOpacity 
          style={styles.viewToggle}
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          <Ionicons name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {FILTERS.map((filter) => (
            <TouchableOpacity 
              key={filter} 
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip, 
                { backgroundColor: activeFilter === filter ? colors.saffron : colors.card || 'rgba(0,0,0,0.05)' }
              ]}
            >
              <Text 
                variant="caption" 
                family="heading" 
                style={{ color: activeFilter === filter ? '#000' : colors.text }}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product List */}
      <FlatList
        data={PRODUCTS}
        key={viewMode} // Re-render when viewMode changes
        numColumns={viewMode === 'grid' ? 2 : 1}
        renderItem={({ item }) => (
          <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
            <SpiceProductCard 
              {...item} 
              onPress={() => router.push(`/product/${item.id}`)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewToggle: {
    padding: 8,
  },
  filterContainer: {
    paddingVertical: 10,
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  gridItem: {
    width: '50%',
    padding: 5,
  },
  listItem: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
