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
  Keyboard,
  Switch
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
  FadeIn
} from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SORT_OPTIONS = [
  { id: 'pop', label: 'Popularity' },
  { id: 'p_asc', label: 'Price Low to High' },
  { id: 'p_desc', label: 'Price High to Low' },
  { id: 'rat', label: 'Rating' },
];

const ORIGINS = ['India', 'Sri Lanka', 'Mexico', 'Turkey', 'Spain'];

const AI_RECIPE_MAP: Record<string, string[]> = {
  'biryani': ['Saffron', 'Cardamom', 'Cloves', 'Cinnamon', 'Star Anise'],
  'taco': ['Cumin', 'Paprika', 'Oregano', 'Chili'],
  'butter chicken': ['Turmeric', 'Kashmiri Mirch', 'Cardamom'],
};

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [searchQuery, setSearchQuery] = useState(q || '');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Advanced Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [heatLevel, setHeatLevel] = useState(0); // 0 = All, 1-10
  const [isOrganic, setIsOrganic] = useState(false);
  const [sortBy, setSortBy] = useState('pop');

  const { data: allProducts, isLoading: isLoadingProducts } = useProducts();
  const { data: categories } = useCategories();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    
    let result = [...allProducts];

    // AI Query Expansion
    const lowerQuery = searchQuery.toLowerCase();
    const recipeSpices = AI_RECIPE_MAP[lowerQuery] || [];

    // Search Filter
    if (searchQuery.length > 0) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        recipeSpices.some(rs => p.name.toLowerCase().includes(rs.toLowerCase()))
      );
    }

    // Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category_id));
    }

    // Origin Filter
    if (selectedOrigins.length > 0) {
      result = result.filter(p => selectedOrigins.includes(p.origin_country || 'India'));
    }

    // Organic Filter
    if (isOrganic) {
      result = result.filter(p => p.is_organic);
    }

    // Heat Level Filter (assuming product has spice_heat_level)
    if (heatLevel > 0) {
      result = result.filter(p => (p.spice_heat_level || 0) <= heatLevel);
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
  }, [allProducts, searchQuery, selectedCategories, selectedOrigins, isOrganic, heatLevel, sortBy]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleOrigin = (name: string) => {
    setSelectedOrigins(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, id]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.searchBar, { backgroundColor: colorScheme === 'light' ? '#F5F5F5' : '#16213E' }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search..."
            placeholderTextColor={colors.tabIconDefault}
          />
          <Ionicons name="search" size={20} color={colors.saffron} />
        </View>
        <TouchableOpacity 
          onPress={() => setShowFilterModal(true)}
          style={[styles.filterBtn, { backgroundColor: selectedCategories.length > 0 || heatLevel > 0 ? colors.saffron : 'transparent' }]}
        >
          <Ionicons name="options-outline" size={24} color={selectedCategories.length > 0 || heatLevel > 0 ? '#000' : colors.text} />
        </TouchableOpacity>
      </View>

      {/* Results Controls */}
      <View style={styles.controlsBar}>
        <Text variant="caption" style={{ opacity: 0.5 }}>{filteredProducts.length} Results found</Text>
        <View style={styles.controlsRight}>
          <TouchableOpacity onPress={() => setShowSortModal(true)} style={styles.controlItem}>
            <Text variant="caption" family="heading" style={{ color: colors.saffron }}>Sort</Text>
            <Ionicons name="chevron-down" size={12} color={colors.saffron} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} style={styles.controlItem}>
            <Ionicons name={viewMode === 'grid' ? 'list' : 'grid'} size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product List */}
      <Animated.FlatList
        data={filteredProducts}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={colors.tabIconDefault} style={{ opacity: 0.2 }} />
            <Text variant="body1" family="heading" style={{ marginTop: 20 }}>No spices found</Text>
            <Text variant="caption" style={{ opacity: 0.5, marginTop: 8 }}>Try adjusting your AI filters or keywords</Text>
          </View>
        )}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal visible={showFilterModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Card glass intensity={30} style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h2" family="heading">Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Heat Meter Section */}
              <View style={styles.filterSection}>
                <Text variant="overline" family="badge" style={styles.filterLabel}>MAX HEAT LEVEL</Text>
                <View style={styles.heatSliderContainer}>
                  <LinearGradient
                    colors={['#2E8B57', '#F4C430', '#C41E3A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.heatBar}
                  />
                  <View style={styles.heatDots}>
                    {[0, 2, 4, 6, 8, 10].map(val => (
                      <TouchableOpacity 
                        key={val} 
                        onPress={() => setHeatLevel(val)}
                        style={[styles.heatDot, heatLevel === val && { backgroundColor: '#fff', transform: [{ scale: 1.5 }] }]}
                      />
                    ))}
                  </View>
                </View>
                <Text variant="caption" style={{ textAlign: 'center', marginTop: 8, color: colors.saffron }}>
                  {heatLevel === 0 ? 'Any Heat' : `Up to Level ${heatLevel}`}
                </Text>
              </View>

              {/* Categories Section */}
              <View style={styles.filterSection}>
                <Text variant="overline" family="badge" style={styles.filterLabel}>CATEGORIES</Text>
                <View style={styles.chipsGrid}>
                  {categories?.map(cat => (
                    <TouchableOpacity 
                      key={cat.id} 
                      onPress={() => toggleCategory(cat.id)}
                      style={[styles.chip, selectedCategories.includes(cat.id) && { backgroundColor: colors.saffron, borderColor: colors.saffron }]}
                    >
                      <Text variant="caption" family="heading" style={{ color: selectedCategories.includes(cat.id) ? '#000' : colors.text }}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Organic Switch */}
              <View style={styles.filterRow}>
                <View>
                  <Text variant="body1" family="heading">Organic Only</Text>
                  <Text variant="caption" style={{ opacity: 0.6 }}>Certified bio-products</Text>
                </View>
                <Switch 
                  value={isOrganic} 
                  onValueChange={setIsOrganic}
                  trackColor={{ false: '#767577', true: colors.cardamom }}
                  thumbColor={isOrganic ? '#fff' : '#f4f3f4'}
                />
              </View>
            </ScrollView>

            <Button 
              title={`SHOW ${filteredProducts.length} RESULTS`} 
              onPress={() => setShowFilterModal(false)} 
              style={styles.applyBtn}
            />
          </Card>
        </View>
      </Modal>

      {/* Sort Modal (Simple) */}
      <Modal visible={showSortModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowSortModal(false)}>
           <Card style={styles.sortModalContent}>
              <Text variant="h3" family="heading" style={{ marginBottom: 20 }}>Sort By</Text>
              {SORT_OPTIONS.map(opt => (
                <TouchableOpacity 
                  key={opt.id} 
                  style={styles.sortItem}
                  onPress={() => { setSortBy(opt.id); setShowSortModal(false); }}
                >
                  <Text style={{ color: sortBy === opt.id ? colors.saffron : colors.text, fontWeight: sortBy === opt.id ? 'bold' : 'normal' }}>{opt.label}</Text>
                  {sortBy === opt.id && <Ionicons name="checkmark" size={20} color={colors.saffron} />}
                </TouchableOpacity>
              ))}
           </Card>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingHorizontal: 20, 
    paddingBottom: 15,
  },
  backBtn: { marginRight: 15 },
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 44, 
    borderRadius: 22, 
    paddingHorizontal: 15,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  filterBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  controlsBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  controlsRight: { flexDirection: 'row', alignItems: 'center' },
  controlItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  divider: { width: 1, height: 16, backgroundColor: 'rgba(0,0,0,0.1)' },
  productList: { padding: 10, paddingBottom: 100 },
  gridItem: { width: '50%', padding: 5 },
  listItem: { width: '100%', padding: 5 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  filterModalContent: { height: '80%', padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  filterSection: { marginBottom: 30 },
  filterLabel: { opacity: 0.5, marginBottom: 15, letterSpacing: 1.5 },
  heatSliderContainer: { height: 12, borderRadius: 6, position: 'relative', justifyContent: 'center' },
  heatBar: { ...StyleSheet.absoluteFillObject, borderRadius: 6 },
  heatDots: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 },
  heatDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: -5 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', margin: 5 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  applyBtn: { marginTop: 'auto', height: 56 },
  sortModalContent: { margin: 20, padding: 24, borderRadius: 24 },
  sortItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.05)' },
});
