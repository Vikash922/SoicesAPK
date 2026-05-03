import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Dimensions, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceProductCard } from '@/components/spice/SpiceProductCard';
import Animated, { 
  FadeIn, 
  FadeInUp, 
  Layout, 
  Transition,
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const FILTER_CHIPS = [
  'Whole', 'Ground', 'Organic', 'Price: Low-High', 'Rating: 4+', 'Heat: Mild', 'Origin: India'
];

const MOCK_RESULTS = [
  { id: '1', name: 'Kashmiri Saffron (1g)', image: 'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=400', price: 499, originalPrice: 699, rating: 4.8 },
  { id: '2', name: 'Turmeric Powder (200g)', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=400', price: 129, originalPrice: 159, rating: 4.5 },
  { id: '3', name: 'Black Pepper (100g)', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400', price: 189, originalPrice: 229, rating: 4.7 },
  { id: '4', name: 'Green Cardamom (50g)', image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400', price: 249, originalPrice: 299, rating: 4.9 },
  { id: '5', name: 'Cinnamon Sticks', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=400', price: 89, rating: 4.6 },
  { id: '6', name: 'Star Anise', image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400', price: 145, rating: 4.4 },
];

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [searchQuery, setSearchQuery] = useState((q as string) || '');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.tabIconDefault + '20' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={[styles.searchBar, { backgroundColor: colorScheme === 'light' ? '#f5f5f5' : colors.card }]}>
          <Ionicons name="search-outline" size={18} color={colors.tabIconDefault} />
          <TextInput
            placeholder="Search spices..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.input, { color: colors.text }]}
            autoFocus={!q}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.tabIconDefault} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Row */}
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
        <View style={styles.sortBtn}>
          <Text variant="caption" family="heading">SORT BY: </Text>
          <Text variant="caption" style={{ color: colors.saffron }}>Popularity v</Text>
        </View>
        <TouchableOpacity onPress={() => setIsGridView(!isGridView)} style={styles.viewToggle}>
          <Ionicons name={isGridView ? "list-outline" : "grid-outline"} size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Grid View */}
      <FlatList
        data={MOCK_RESULTS}
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
            />
          </Animated.View>
        )}
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
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  backBtn: { marginRight: 15 },
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    height: 44, 
    borderRadius: 12 
  },
  input: { flex: 1, marginLeft: 10, fontSize: 14, fontFamily: 'Inter_400Regular' },
  filterSection: { paddingVertical: 12 },
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
    marginBottom: 10
  },
  sortBtn: { flexDirection: 'row', alignItems: 'center' },
  viewToggle: { padding: 5 },
  resultsList: { paddingHorizontal: 10, paddingBottom: 100 },
  gridItem: { width: '50%', padding: 5 },
  listItem: { width: '100%', padding: 5 },
  listCard: { width: '100%' }
});
