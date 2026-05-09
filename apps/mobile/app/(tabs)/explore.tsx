import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceProductCard } from '@/components/spice/SpiceProductCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { SpiceShimmerLoader } from '@/components/spice/SpiceShimmerLoader';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: allProducts, isLoading: isLoadingProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const filters = useMemo(() => {
    const baseFilters = ['All'];
    if (categories) {
      return [...baseFilters, ...categories.map(c => c.name)];
    }
    return baseFilters;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    if (activeFilter === 'All') return allProducts;
    
    const selectedCategory = categories?.find(c => c.name === activeFilter);
    if (!selectedCategory) return allProducts;
    
    return allProducts.filter(p => p.category_id === selectedCategory.id);
  }, [allProducts, activeFilter, categories]);

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
          {filters.map((filter) => (
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
      {isLoadingProducts ? (
        <View style={styles.productList}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SpiceShimmerLoader 
              key={i} 
              variant={viewMode === 'grid' ? 'card' : 'list'} 
              style={viewMode === 'grid' ? { width: '48%', height: 240, margin: '1%' } : { marginBottom: 10 }} 
            />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          key={viewMode} // Re-render when viewMode changes
          numColumns={viewMode === 'grid' ? 2 : 1}
          renderItem={({ item, index }) => (
            <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
              <SpiceProductCard 
                id={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                originalPrice={item.original_price}
                rating={item.avg_rating || 0}
                variant={viewMode}
                index={index}
                onPress={() => router.push(`/product/${item.id}`)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
