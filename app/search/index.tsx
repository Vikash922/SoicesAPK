import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  TextInput,
  Platform,
  Keyboard,
  FlatList
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { 
  FadeIn, 
  FadeInUp, 
  FadeInDown, 
  Layout 
} from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const RECENT_SEARCHES = ['Kashmiri Mirch', 'Whole Cardamom', 'Organic Turmeric'];
const TRENDING_SEARCHES = ['Saffron', 'Biryani Masala', 'Smoked Paprika', 'Cloves'];

const FLAVOR_PROFILES = [
  { id: 'smoky', label: 'Smoky', icon: 'bonfire-outline', color: '#E8590C' },
  { id: 'earthy', label: 'Earthy', icon: 'leaf-outline', color: '#4A7C59' },
  { id: 'floral', label: 'Floral', icon: 'flower-outline', color: '#E2B714' },
  { id: 'citrus', label: 'Citrusy', icon: 'sunny-outline', color: '#FFD700' },
  { id: 'nutty', label: 'Nutty', icon: 'nutrition-outline', color: '#8B4513' },
];

const RECIPE_MATCHES = [
  { id: '1', title: 'Hyderabadi Biryani', subtitle: 'Essential: Saffron, Cardamom, Cloves', query: 'biryani' },
  { id: '2', title: 'Butter Chicken', subtitle: 'Essential: Kasuri Methi, Kashmiri Mirch', query: 'butter chicken' },
  { id: '3', title: 'Taco Seasoning', subtitle: 'Essential: Cumin, Paprika, Oregano', query: 'taco' },
];

export default function SearchLandingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Search Bar with Glassmorphism */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.searchBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)' }]}>
            <Ionicons name="search" size={20} color={colors.saffron} />
            <TextInput
              autoFocus
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by spice, flavor, or recipe..."
              placeholderTextColor={colors.tabIconDefault}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.tabIconDefault} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Recent Searches */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="overline" family="badge" style={styles.sectionTitle}>RECENT SEARCHES</Text>
            <TouchableOpacity><Text variant="caption" style={{ color: colors.saffron }}>Clear</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentList}>
            {RECENT_SEARCHES.map((item, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => handleSearch(item)}
                style={[styles.recentChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff' }]}
              >
                <Ionicons name="time-outline" size={14} color={colors.tabIconDefault} style={{ marginRight: 6 }} />
                <Text variant="body2">{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* AI Flavor Profiling */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <Text variant="overline" family="badge" style={styles.sectionTitle}>SEARCH BY FLAVOR PROFILE</Text>
          <View style={styles.flavorGrid}>
            {FLAVOR_PROFILES.map((profile, i) => (
              <TouchableOpacity 
                key={profile.id}
                onPress={() => handleSearch(profile.label)}
                style={styles.flavorItem}
              >
                <Card glass intensity={10} style={styles.flavorCard}>
                  <View style={[styles.flavorIcon, { backgroundColor: profile.color + '20' }]}>
                    <Ionicons name={profile.icon as any} size={22} color={profile.color} />
                  </View>
                  <Text variant="caption" family="heading" style={{ marginTop: 8 }}>{profile.label}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* AI Recipe Matcher */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="overline" family="badge" style={styles.sectionTitle}>RECIPE SPICE MATCHER</Text>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={10} color="#fff" />
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          </View>
          {RECIPE_MATCHES.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id} 
              onPress={() => handleSearch(recipe.query)}
              style={styles.recipeItem}
            >
              <Card glass intensity={5} style={styles.recipeCardContent}>
                <View style={styles.recipeInfo}>
                  <Text variant="body1" family="heading">{recipe.title}</Text>
                  <Text variant="caption" style={{ opacity: 0.6 }}>{recipe.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.saffron} />
              </Card>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Trending Searches */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <Text variant="overline" family="badge" style={styles.sectionTitle}>TRENDING NOW</Text>
          <View style={styles.trendingList}>
            {TRENDING_SEARCHES.map((item, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => handleSearch(item)}
                style={styles.trendingItem}
              >
                <Ionicons name="trending-up" size={16} color={colors.saffron} />
                <Text variant="body2" style={styles.trendingText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 15 },
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 46, 
    borderRadius: 23, 
    paddingHorizontal: 15,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 14,
    height: '100%',
  },
  scrollContent: { padding: 20 },
  section: { marginBottom: 30 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  sectionTitle: { opacity: 0.5, letterSpacing: 1.5 },
  recentList: { flexDirection: 'row' },
  recentChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  flavorGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginHorizontal: -5 
  },
  flavorItem: { 
    width: '33.33%', 
    padding: 5 
  },
  flavorCard: { 
    alignItems: 'center', 
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  flavorIcon: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9C27B0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  recipeItem: { marginBottom: 12 },
  recipeCardContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  recipeInfo: { flex: 1 },
  trendingList: { marginTop: 5 },
  trendingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  trendingText: { marginLeft: 15 },
});
