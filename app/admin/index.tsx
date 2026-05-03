import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Platform GMV', value: '₹1,24,500', icon: 'cash-outline', color: '#E2B714' },
  { label: 'Active Users', value: '1,240', icon: 'people-outline', color: '#2E8B57' },
  { label: 'Total Orders', value: '450', icon: 'bag-handle-outline', color: '#E8590C' },
  { label: 'Server Uptime', value: '99.9%', icon: 'pulse-outline', color: '#C41E3A' },
];

export default function AdminScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text variant="h2" family="heading">Super Admin Panel</Text>
          <Text variant="caption" style={{ opacity: 0.6 }}>System Overview & Management</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <Animated.View 
              key={stat.label} 
              entering={FadeInUp.delay(i * 100)}
              style={[styles.statCard, { backgroundColor: colors.card || '#fff' }]}
            >
              <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text variant="h3" family="heading" style={styles.statValue}>{stat.value}</Text>
              <Text variant="overline" style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Text variant="overline" family="badge" style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.saffron }]}>
            <Ionicons name="refresh-outline" size={20} color="#000" />
            <Text variant="body2" family="heading" style={styles.actionBtnText}>SEED DATABASE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.cardamom || '#2E8B57', marginTop: 10 }]}>
            <Ionicons name="add-outline" size={20} color="#fff" />
            <Text variant="body2" family="heading" style={[styles.actionBtnText, { color: '#fff' }]}>ADD NEW PRODUCT</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="overline" family="badge" style={styles.sectionTitle}>RECENT ORDERS</Text>
            <TouchableOpacity><Text variant="caption" style={{ color: colors.saffron }}>View All</Text></TouchableOpacity>
          </View>
          {[1, 2, 3].map((id, i) => (
            <Animated.View 
              key={id} 
              entering={FadeInRight.delay(400 + i * 100)}
              style={[styles.activityCard, { backgroundColor: colors.card || '#fff' }]}
            >
              <View style={styles.activityInfo}>
                <Text variant="body2" family="heading">ORD-772{id}</Text>
                <Text variant="caption" style={{ opacity: 0.6 }}>24 May 2024 • 2 items</Text>
              </View>
              <View style={styles.activityMeta}>
                <Text variant="body2" family="heading" style={{ color: colors.saffron }}>₹899</Text>
                <View style={[styles.statusBadge, { backgroundColor: colors.cardamom + '20' }]}>
                  <Text variant="overline" style={{ color: colors.cardamom, fontSize: 8 }}>DELIVERED</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { marginRight: 15, padding: 4 },
  scrollContent: { paddingHorizontal: 20 },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    width: (width - 50) / 2,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: { fontSize: 18 },
  statLabel: { opacity: 0.6, marginTop: 2 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { opacity: 0.5, letterSpacing: 1.5 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
  },
  actionBtnText: { marginLeft: 10, letterSpacing: 1 },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
  },
  activityInfo: { flex: 1 },
  activityMeta: { alignItems: 'flex-end' },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
});