import React from 'react';
import { StyleSheet, ScrollView, Pressable, View as DefaultView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SpiceCarousel } from '@/components/spice/SpiceCarousel';
import { SpiceCategoryCard } from '@/components/spice/SpiceCategoryCard';
import { MOCK_TRENDING, MOCK_CATEGORIES } from '@/constants/MockData';

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Title */}
      <View style={styles.header}>
        <Text variant="h1" family="display">Explore</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Fake Search Bar */}
        <Pressable 
          onPress={() => router.push('/search/results')} 
          style={[
            styles.fakeSearchBar, 
            { backgroundColor: colorScheme === 'light' ? '#f5f5f5' : colors.card }
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.tabIconDefault} />
          <Text style={[styles.fakePlaceholder, { color: colors.tabIconDefault }]}>Search spices...</Text>
        </Pressable>
        
        {/* Trending Carousel */}
        <View style={styles.sectionHeader}>
          <Text variant="h2" family="display">Trending Today</Text>
          <Pressable onPress={() => router.push('/search/results')}>
            <Text variant="caption" style={{ color: colors.saffron }}>View All</Text>
          </Pressable>
        </View>
        <SpiceCarousel 
          items={MOCK_TRENDING.map(item => ({
            ...item,
            onPress: () => router.push(`/search/results?q=${item.title}`)
          }))} 
        />

        {/* Categories Grid */}
        <View style={styles.sectionHeader}>
          <Text variant="h2" family="display">Categories</Text>
        </View>
        <View style={styles.categoryGrid}>
          {MOCK_CATEGORIES.map(cat => (
            <SpiceCategoryCard 
              key={cat.id} 
              {...cat} 
              onPress={() => router.push(`/search/results?cat=${cat.name}`)} 
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  fakeSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 25,
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 12,
  },
  fakePlaceholder: {
    marginLeft: 10,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 20,
  },
});
