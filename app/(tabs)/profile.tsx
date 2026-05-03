import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

const MENU_ITEMS = [
  { id: '1', title: 'My Orders', icon: 'bag-handle-outline' },
  { id: '2', title: 'Saved Addresses', icon: 'location-outline' },
  { id: '3', title: 'Payment Methods', icon: 'card-outline' },
  { id: '4', title: 'Spice Points', icon: 'star-outline', extra: '1,250 pts' },
  { id: '5', title: 'Notifications', icon: 'notifications-outline' },
  { id: 'admin', title: 'Super Admin Panel', icon: 'shield-checkmark-outline', adminOnly: true },
  { id: '6', title: 'Help & Support', icon: 'help-circle-outline' },
  { id: '7', title: 'Settings', icon: 'settings-outline' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const isAdmin = user?.email === 'jyoti3322114455@gmail.com' || true; // Force true for testing as requested

  const filteredMenu = MENU_ITEMS.filter(item => !item.adminOnly || isAdmin);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text variant="h1" family="heading">Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: colors.card || '#fff' }]}>
          <Image 
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' }} 
            style={styles.avatar} 
          />
          <View style={styles.userInfo}>
            <Text variant="h2" family="heading">{user?.name || 'John Doe'}</Text>
            <Text variant="caption" style={{ opacity: 0.6 }}>{user?.email || 'john.doe@example.com'}</Text>
            <View style={[styles.tierBadge, { backgroundColor: colors.saffron }]}>
              <Ionicons name="ribbon" size={12} color="#000" />
              <Text variant="overline" family="badge" style={styles.tierText}>GOLD MEMBER</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text variant="h3" family="heading" style={{ color: colors.saffron }}>12</Text>
            <Text variant="overline">Orders</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.tabIconDefault + '33' }]} />
          <View style={styles.statBox}>
            <Text variant="h3" family="heading" style={{ color: colors.saffron }}>₹2,450</Text>
            <Text variant="overline">Saved</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.tabIconDefault + '33' }]} />
          <View style={styles.statBox}>
            <Text variant="h3" family="heading" style={{ color: colors.saffron }}>4.8</Text>
            <Text variant="overline">Rating</Text>
          </View>
        </View>

        {/* Menu List */}
        <View style={styles.menuList}>
          {filteredMenu.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => item.id === 'admin' ? router.push('/admin') : null}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.adminOnly ? colors.chili + '15' : colors.saffron + '15' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.adminOnly ? colors.chili : colors.saffron} />
              </View>
              <Text variant="body1" family="heading" style={styles.menuTitle}>{item.title}</Text>
              {item.extra && (
                <Text variant="caption" family="heading" style={[styles.menuExtra, { color: colors.cardamom }]}>
                  {item.extra}
                </Text>
              )}
              <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text variant="body1" family="heading" style={{ color: colors.chili }}>Logout</Text>
        </TouchableOpacity>

        <Text variant="overline" style={styles.versionText}>Version 1.0.2 (Build 42)</Text>
        <View style={{ height: 120 }} />
      </ScrollView>
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  userCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  userInfo: { marginLeft: 20, flex: 1 },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  tierText: { color: '#000', marginLeft: 4, fontSize: 8 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 30 },
  menuList: { marginBottom: 30 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuTitle: { flex: 1 },
  menuExtra: { marginRight: 10 },
  logoutBtn: {
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 20,
  },
  versionText: { textAlign: 'center', opacity: 0.3 },
});
