import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const ORDERS = [
  { id: '1', orderNo: 'SPC-2847', date: '3 May 2025', status: 'Out for Delivery', total: 897, items: 3, thumb: 'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=100' },
  { id: '2', orderNo: 'SPC-2710', date: '28 April 2025', status: 'Delivered', total: 1245, items: 5, thumb: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=100' },
  { id: '3', orderNo: 'SPC-2601', date: '15 April 2025', status: 'Delivered', total: 450, items: 2, thumb: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=100' },
  { id: '4', orderNo: 'SPC-2580', date: '2 April 2025', status: 'Cancelled', total: 890, items: 4, thumb: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=100' },
];

export default function OrderListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Out for Delivery': return colors.saffron;
      case 'Delivered': return colors.cardamom;
      case 'Cancelled': return colors.chili;
      default: return colors.tabIconDefault;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'My Orders',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />

      <FlatList
        data={ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity 
              style={[styles.orderCard, { backgroundColor: colors.card || '#fff' }]}
              onPress={() => router.push(`/order/${item.id}`)}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text variant="body1" family="heading">{item.orderNo}</Text>
                  <Text variant="caption" style={{ opacity: 0.5 }}>{item.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                   <Text variant="overline" style={{ color: getStatusColor(item.status) }}>{item.status.toUpperCase()}</Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '20' }]} />

              <View style={styles.orderFooter}>
                <View style={styles.itemsPreview}>
                   <Image source={{ uri: item.thumb }} style={styles.thumb} />
                   <Text variant="caption" style={{ marginLeft: 10 }}>+ {item.items - 1} other items</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                   <Text variant="caption">Total Amount</Text>
                   <Text variant="body1" family="price" style={{ color: colors.saffron }}>₹{item.total}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBtn: { padding: 10 },
  listContent: { padding: 20 },
  orderCard: { 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  divider: { height: 1, marginVertical: 15 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemsPreview: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 32, height: 32, borderRadius: 6 },
});
