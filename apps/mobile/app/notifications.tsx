import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const NOTIFICATIONS = [
  { 
    id: '1', 
    type: 'order', 
    title: 'Order Out for Delivery', 
    body: 'Your order #SPC-2847 is out for delivery with our partner. ETA 25 mins.', 
    time: '10 mins ago',
    isRead: false
  },
  { 
    id: '2', 
    type: 'promo', 
    title: 'Flash Sale: 50% OFF!', 
    body: 'Organic Turmeric and Pepper at half price for the next 2 hours.', 
    time: '2 hours ago',
    isRead: false
  },
  { 
    id: '3', 
    type: 'system', 
    title: 'Welcome to SpiceCart!', 
    body: 'Start exploring the world of premium spices and get 10% off on your first order.', 
    time: '1 day ago',
    isRead: true
  },
  { 
    id: '4', 
    type: 'review', 
    title: 'How was the Saffron?', 
    body: 'Share your experience with Kashmiri Saffron and earn 50 Spice Points.', 
    time: '2 days ago',
    isRead: true
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return { name: 'bicycle-outline', color: colors.cardamom };
      case 'promo': return { name: 'gift-outline', color: colors.chili };
      case 'review': return { name: 'star-outline', color: colors.saffron };
      default: return { name: 'notifications-outline', color: colors.info };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Notifications',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={markAllRead} style={styles.headerBtn}>
              <Text variant="caption" family="heading" style={{ color: colors.saffron }}>READ ALL</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
           <Ionicons name="notifications-off-outline" size={80} color={colors.tabIconDefault} />
           <Text variant="h3" family="heading" style={{ marginTop: 20, opacity: 0.6 }}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const icon = getIcon(item.type);
            return (
              <Animated.View 
                entering={FadeInUp.delay(index * 100)}
                layout={Layout.springify()}
                style={[
                  styles.notificationItem, 
                  { backgroundColor: colors.card || '#fff', opacity: item.isRead ? 0.7 : 1 }
                ]}
              >
                {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.saffron }]} />}
                <View style={[styles.iconBox, { backgroundColor: icon.color + '15' }]}>
                   <Ionicons name={icon.name as any} size={24} color={icon.color} />
                </View>
                <View style={styles.contentBox}>
                   <View style={styles.row}>
                      <Text variant="body1" family="heading" style={{ flex: 1 }}>{item.title}</Text>
                      <Text variant="caption" style={{ opacity: 0.5 }}>{item.time}</Text>
                   </View>
                   <Text variant="body2" style={styles.bodyText}>{item.body}</Text>
                </View>
              </Animated.View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBtn: { padding: 10 },
  listContent: { padding: 20 },
  notificationItem: { 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  unreadDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4 },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  contentBox: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  bodyText: { opacity: 0.7, lineHeight: 20 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
});
