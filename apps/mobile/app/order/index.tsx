import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');

export default function OrderListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { data: orders, isLoading } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out_for_delivery': return colors.saffron;
      case 'delivered': return colors.cardamom;
      case 'cancelled': return colors.chili;
      case 'confirmed': return '#4285F4';
      default: return colors.tabIconDefault;
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.saffron} />
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="bag-outline" size={80} color={colors.tabIconDefault} style={{ opacity: 0.3 }} />
        <Text variant="h2" family="heading" style={{ marginTop: 20 }}>No orders yet</Text>
        <Text variant="body2" style={{ opacity: 0.6, textAlign: 'center', marginTop: 10, marginBottom: 30 }}>
          You haven't placed any orders yet. Start shopping to see your orders here!
        </Text>
        <Button title="START SHOPPING" onPress={() => router.replace('/(tabs)/')} style={{ width: '100%' }} />
      </View>
    );
  }

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
        data={orders}
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
                  <Text variant="body1" family="heading">#{item.order_number}</Text>
                  <Text variant="caption" style={{ opacity: 0.5 }}>
                    {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                   <Text variant="overline" style={{ color: getStatusColor(item.status), fontSize: 9 }}>{formatStatus(item.status)}</Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '20' }]} />

              <View style={styles.orderFooter}>
                <View style={styles.itemsPreview}>
                   <Ionicons name="cube-outline" size={20} color={colors.tabIconDefault} />
                   <Text variant="caption" style={{ marginLeft: 10 }}>{item.items_count} items</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                   <Text variant="caption">Total Amount</Text>
                   <Text variant="body1" family="price" style={{ color: colors.saffron }}>₹{item.total_amount}</Text>
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
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
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
});

