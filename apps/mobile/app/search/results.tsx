import React, { useState, useEffect, useMemo } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  TextInput, 
  FlatList, 
  Dimensions,
  TouchableOpacity,
  Modal,
  Platform,
  Keyboard
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceProductCard } from '@/components/spice/SpiceProductCard';
import { SpiceShimmerLoader } from '@/components/spice/SpiceShimmerLoader';
import { useProducts, useCategories } from '@/hooks/useProducts';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SORT_OPTIONS = [
  { id: 'pop', label: 'Popularity' },
  { id: 'p_asc', label: 'Price Low to High' },
  { id: 'p_desc', label: 'Price High to Low' },
  { id: 'rat', label: 'Rating' },
];

function FilterChip({ 
  label, 
  isSelected, 
  onPress 
}: { 
  label: string, 
  isSelected: boolean, 
  onPress: () => void 
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: isSelected ? colors.saffron : (colorScheme === 'light' ? '#f0f0f0' : colors.card),
  }));

  const handlePress = () => {
    scale.value = withSpring(1.2, { damping: 10, stiffness: 200 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.chip, animatedStyle]}>
        <Text 
          style={[
            styles.chipText, 
            { color: isSelected ? '#000' : colors.text }
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [searchQuery, setSearchQuery] = useState(q || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('pop');
  const [showSortModal, setShowSortModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: allProducts, isLoading: isLoadingProducts } = useProducts();
  const { data: categories } = useCategories();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    
    let result = [...allProducts];

    // Search Query Filter
    if (searchQuery.length > 0) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category Filters
    if (selectedFilters.length > 0) {
      result = result.filter(p => selectedFilters.includes(p.category_id));
    }

    // Sort
    if (sortBy === 'p_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'p_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rat') {
      result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    }

    return result;
  }, [allProducts, searchQuery, selectedFilters, sortBy]);

  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2 || !allProducts) return [];
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [allProducts, searchQuery]);

  const toggleFilter = (id: string) => {
    setSelectedFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getSortLabel = () => SORT_OPTIONS.find(o => o.id === sortBy)?.label;

  const handleSuggestionPress = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sticky Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'light' ? '#f5f5f5' : colors.card }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search spices..."
            placeholderTextColor={colors.tabIconDefault}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.tabIconDefault} style={{ marginRight: 8 }} />
            </TouchableOpacity>
          )}
          <Ionicons name="search" size={20} color={colors.saffron} />
        </View>
      </View>

      {/* Suggestions List Overlay */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles.suggestionsList, { backgroundColor: colors.card, borderTopColor: colors.tabIconDefault + '22' }]}>
          {suggestions.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(item.name)}
            >
              <Ionicons name="search-outline" size={16} color={colors.tabIconDefault} />
              <Text style={styles.suggestionText}>{item.name}</Text>
              <Ionicons name="arrow-forward-outline" size={16} color={colors.tabIconDefault} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.closeSuggestions} 
            onPress={() => setShowSuggestions(false)}
          >
            <Text variant="caption" style={{ color: colors.saffron }}>Close Suggestions</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters Section */}
      <View style={styles.filtersWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersScroll}
        >
          {categories?.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.name}
              isSelected={selectedFilters.includes(cat.id)}
              onPress={() => toggleFilter(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Sort & Toggle Bar */}
      <View style={styles.sortBar}>
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="swap-vertical" size={18} color={colors.saffron} />
          <Text variant="body2" family="heading" style={{ marginLeft: 6 }}>{getSortLabel()}</Text>
        </TouchableOpacity>

        <View style={styles.viewToggle}>
          <TouchableOpacity 
            onPress={() => setViewMode('grid')}
            style={[styles.toggleBtn, viewMode === 'grid' && { backgroundColor: colors.saffron }]}
          >
            <Ionicons name="grid-outline" size={18} color={viewMode === 'grid' ? '#000' : colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setViewMode('list')}
            style={[styles.toggleBtn, viewMode === 'list' && { backgroundColor: colors.saffron }]}
          >
            <Ionicons name="list-outline" size={18} color={viewMode === 'list' ? '#000' : colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product List / Skeleton */}
      {isLoadingProducts ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode + '_loading'}
          renderItem={() => (
            <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
              <SpiceShimmerLoader variant={viewMode === 'grid' ? 'card' : 'list'} />
            </View>
          )}
          contentContainerStyle={styles.productList}
        />
      ) : (
        <Animated.FlatList
          data={filteredProducts}
          onScroll={scrollHandler}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
              <SpiceProductCard 
                id={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                originalPrice={item.original_price}
                rating={item.avg_rating || 0}
                index={index}
                variant={viewMode}
                onPress={() => router.push(`/product/${item.id}`)}
              />
            </View>
          )}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      )}

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowSortModal(false)}
        >
          <View 
            style={[
              styles.modalContent, 
              { backgroundColor: colors.card || (colorScheme === 'light' ? '#fff' : '#16213E') }
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalDragHandle} />
              <Text variant="h3" family="heading" style={{ marginTop: 10 }}>Sort By</Text>
            </View>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity 
                key={option.id} 
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(option.id);
                  setShowSortModal(false);
                }}
              >
                <Text 
                  style={[
                    styles.sortOptionText, 
                    { 
                      color: sortBy === option.id ? colors.saffron : colors.text,
                      fontWeight: sortBy === option.id ? 'bold' : 'normal'
                    }
                  ]}
                >
                  {option.label}
                </Text>
                {sortBy === option.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.saffron} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 15,
    paddingBottom: 15,
    zIndex: 100,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  suggestionsList: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 105 : 85,
    left: 15,
    right: 15,
    zIndex: 99,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingVertical: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  closeSuggestions: {
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  filtersWrapper: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  filtersScroll: {
    paddingHorizontal: 15,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(226, 183, 20, 0.1)',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  gridItem: {
    width: '50%',
    padding: 5,
  },
  listItem: {
    width: '100%',
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sortOptionText: {
    fontSize: 16,
  },
});
