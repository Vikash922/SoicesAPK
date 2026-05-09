import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HomeHeader = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.outerContainer}>
      <BlurView 
        intensity={isDark ? 40 : 60} 
        tint={isDark ? 'dark' : 'default'}
        style={[styles.blurContainer, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text variant="h2" family="display" style={{ color: colors.saffron, fontSize: 28 }}>
              SpiceCart
            </Text>
            <View style={styles.topActions}>
              <TouchableOpacity 
                style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
                accessibilityLabel="Notifications"
                accessibilityRole="button"
              >
                <Ionicons name="notifications-outline" size={22} color={colors.text} />
                <View style={[styles.badge, { backgroundColor: colors.chili }]} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => router.push('/search/results')}
            style={[
              styles.searchBar, 
              { 
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }
            ]}
            activeOpacity={0.8}
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
            <View style={[styles.locationPill, { backgroundColor: isDark ? 'rgba(226, 183, 20, 0.1)' : 'rgba(226, 183, 20, 0.05)' }]}>
              <Ionicons name="location-outline" size={14} color={colors.saffron} />
              <Text variant="caption" style={styles.locationText}>
                Delivering to <Text variant="caption" family="heading" style={{ color: colors.saffron }}>Mumbai, MH 400001</Text>
              </Text>
              <Ionicons name="chevron-down" size={12} color={colors.saffron} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  blurContainer: {
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    paddingHorizontal: 20,
  },
  topRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15,
  },
  topActions: { 
    flexDirection: 'row', 
  },
  iconBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 20,
  },
  badge: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    width: 8, 
    height: 8, 
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    height: 46, 
    borderRadius: 14, 
    marginBottom: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInputContainer: { 
    flex: 1, 
    marginLeft: 10, 
  },
  locationBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  locationText: { 
    marginLeft: 4, 
    fontSize: 12,
  },
});
