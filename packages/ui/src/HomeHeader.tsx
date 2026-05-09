import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

export const HomeHeader = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View 
      style={[styles.container, { backgroundColor: colors.background }]}
      accessibilityRole="header"
    >
      <View style={styles.topRow}>
        <Text variant="h2" family="display" style={{ color: colors.saffron }}>SpiceCart</Text>
        <View style={styles.topActions}>
          <TouchableOpacity 
            style={styles.iconBtn}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={[styles.badge, { backgroundColor: colors.chili }]} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => router.push('/search/results')}
        style={[styles.searchBar, { backgroundColor: colorScheme === 'light' ? '#F5F5F5' : '#16213E' }]}
        accessibilityLabel="Search spices, blends, masalas"
        accessibilityRole="search"
      >
        <Ionicons name="search-outline" size={20} color={colors.tabIconDefault} />
        <View style={styles.searchInputContainer}>
          <Text style={{ color: colors.tabIconDefault, fontSize: 14 }}>Search spices, blends, masalas...</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.locationBar}
        accessibilityLabel="Delivery location"
        accessibilityRole="button"
        accessibilityHint="Tap to change delivery address"
      >
        <Ionicons name="location-outline" size={16} color={colors.saffron} />
        <Text variant="caption" style={styles.locationText}>Delivering to <Text variant="caption" family="heading" style={{ color: colors.saffron }}>Mumbai, MH 400001</Text> v</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, backgroundColor: 'transparent' },
  topActions: { flexDirection: 'row', backgroundColor: 'transparent' },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 48, borderRadius: 12, marginBottom: 12 },
  searchInputContainer: { flex: 1, marginLeft: 10, backgroundColor: 'transparent' },
  locationBar: { flexDirection: 'row', alignItems: 'center', height: 44, backgroundColor: 'transparent' },
  locationText: { marginLeft: 4, opacity: 0.7 },
});
