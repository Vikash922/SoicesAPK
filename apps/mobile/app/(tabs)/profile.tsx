import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Switch, Platform, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { SpiceShimmerLoader } from '@/components/spice/SpiceShimmerLoader';

const MENU_ITEMS = [
  { id: 'orders', title: 'My Orders', icon: 'bag-handle-outline', route: '/order' },
  { id: 'address', title: 'Saved Addresses', icon: 'location-outline' },
  { id: 'payment', title: 'Payment Methods', icon: 'card-outline' },
  { id: 'wishlist', title: 'Wishlist', icon: 'heart-outline', route: '/(tabs)/wishlist' },
  { id: 'points', title: 'Spice Points', icon: 'ribbon-outline', extra: '0 pts' },
  { id: 'notifications', title: 'Notifications', icon: 'notifications-outline', route: '/notifications' },
  { id: 'dark_mode', title: 'Dark Mode', icon: 'moon-outline', isSwitch: true },
  { id: 'language', title: 'Language', icon: 'globe-outline', extra: 'English' },
  { id: 'ai', title: 'AI Recommendations', icon: 'bulb-outline' },
  { id: 'help', title: 'Help & Support', icon: 'help-circle-outline' },
  { id: 'about', title: 'About', icon: 'information-circle-outline' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isGuest } = useAuthStore();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const handleMenuPress = (item: any) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  const renderUserCard = () => {
    if (isGuest) {
      return (
        <View style={[styles.userCard, { backgroundColor: colors.card || '#fff', justifyContent: 'center', paddingVertical: 40 }]}>
          <View style={{ alignItems: 'center' }}>
            <View style={[styles.guestAvatar, { backgroundColor: colors.background }]}>
              <Ionicons name="person-outline" size={40} color={colors.tabIconDefault} />
            </View>
            <Text variant="h2" family="heading" style={{ marginTop: 15 }}>Welcome, Guest!</Text>
            <Text variant="caption" style={{ opacity: 0.6, marginBottom: 20 }}>Login to track orders and earn points.</Text>
            <Button title="LOGIN / SIGN UP" onPress={() => router.push('/(auth)/login')} style={{ width: '100%' }} />
          </View>
        </View>
      );
    }

    if (isLoadingProfile) {
      return <SpiceShimmerLoader variant="card" style={{ height: 160, marginBottom: 25 }} />;
    }

    return (
      <View style={[styles.userCard, { backgroundColor: colors.card || '#fff' }]}>
        <Image 
          source={{ uri: profile?.avatar_url || user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' }} 
          style={styles.avatar} 
        />
        <View style={styles.userInfo}>
          <Text variant="h2" family="heading">{profile?.full_name || user?.user_metadata?.full_name || 'Spice Enthusiast'}</Text>
          <Text variant="caption" style={{ opacity: 0.6 }}>{user?.email}</Text>
          <View style={[styles.tierBadge, { backgroundColor: colors.saffron + '22' }]}>
            <Text variant="overline" family="badge" style={{ color: colors.saffron, fontSize: 8 }}>🏅 {profile?.membership_tier?.toUpperCase() || 'SPICE SEEKER'}</Text>
          </View>
          <View style={styles.pointsRow}>
             <Ionicons name="star" size={12} color={colors.turmeric} />
             <Text variant="caption" family="heading" style={{ marginLeft: 4 }}>{profile?.spice_points || 0} Spice Points</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="h1" family="heading" style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderUserCard()}

        {/* Menu List */}
        <View style={[styles.menuList, { backgroundColor: colors.card || '#fff' }]}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem, 
                index === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }
              ]}
              disabled={item.isSwitch}
              onPress={() => handleMenuPress(item)}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.background }]}>
                <Ionicons name={item.icon as any} size={20} color={colors.saffron} />
              </View>
              <Text variant="body1" family="heading" style={styles.menuTitle}>{item.title}</Text>
              
              {item.isSwitch ? (
                <Switch 
                  value={isDarkMode} 
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: '#767577', true: colors.saffron }}
                  thumbColor={Platform.OS === 'ios' ? '#fff' : (isDarkMode ? '#fff' : '#f4f3f4')}
                />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.id === 'points' && profile ? (
                    <Text variant="caption" family="heading" style={[styles.menuExtra, { color: colors.tabIconDefault }]}>
                      {profile.spice_points} pts
                    </Text>
                  ) : item.extra && (
                    <Text variant="caption" family="heading" style={[styles.menuExtra, { color: colors.tabIconDefault }]}>
                      {item.extra}
                    </Text>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={colors.tabIconDefault} />
                </View>
              )}
            </TouchableOpacity>
          ))}
          
          {!isGuest && (
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={20} color={colors.chili} />
              <Text variant="body1" family="heading" style={{ color: colors.chili, marginLeft: 15 }}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text variant="overline" style={styles.versionText}>v2.1.0</Text>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtn: { padding: 5 },
  headerTitle: { flex: 1, textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  userCard: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)' },
  guestAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  userInfo: { marginLeft: 20, flex: 1 },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
  },
  pointsRow: { flexDirection: 'row', alignItems: 'center' },
  menuList: { borderRadius: 24, padding: 10, marginBottom: 30 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuTitle: { flex: 1 },
  menuExtra: { marginRight: 8 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  versionText: { textAlign: 'center', opacity: 0.3, letterSpacing: 2 },
});
