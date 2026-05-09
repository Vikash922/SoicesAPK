import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  ActivityIndicator,
  View as DefaultView 
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '@/store/useCartStore';

const { width } = Dimensions.get('window');

export default function OrderListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const addItem = useCartStore((state) => state.addItem);

  const { data: orders, isLoading } = useOrders();

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'out_for_delivery': return { color: colors.saffron, icon: 'bicycle-outline' };
      case 'delivered': return { color: colors.cardamom, icon: 'checkmark-done-outline' };
      case 'cancelled': return { color: colors.chili, icon: 'close-circle-outline' };
      case 'confirmed': return { color: '#4285F4', icon: 'ribbon-outline' };
      default: return { color: colors.tabIconDefault, icon: 'cube-outline' };
    }
  };

  const handleReorder = (order: any) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Add all items from this order to cart (simplified)
    // In a real app, you'd fetch the product details
    router.push('/(tabs)/cart');
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
        <LottieView 
          source={require('@/assets/lottie/empty_jar.json')} 
          autoPlay 
          loop 
          style={styles.emptyLottie} 
        />
        <Text variant="h2" family="heading" style={{ marginTop: -20 }}>Your Spice Box is Empty</Text>
        <Text variant="body2" style={{ opacity: 0.6, textAlign: 'center', marginTop: 10, marginBottom: 30 }}>
          You haven't placed any orders yet. Start your aromatic journey today!
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
          headerTitle: 'Order History',
          headerTitleStyle: { fontFamily: 'Poppins-Bold' },
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
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const statusInfo = getStatusInfo(item.status);
          return (
            <Animated.View entering={FadeInUp.delay(index * 100)} layout={Layout.springify()}>
              <Card glass intensity={5} style={styles.orderCard}>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => router.push(`/order/${item.id}`)}
                >
                  <View style={styles.orderHeader}>
                    <View style={styles.orderMeta}>
                      <View style={[styles.statusIcon, { backgroundColor: statusInfo.color + '15' }]}>
                        <Ionicons name={statusInfo.icon as any} size={20} color={statusInfo.color} />
                      </View>
                      <View style={{ marginLeft: 12 }}>
                        <Text variant="body2" family="heading">Order #{item.order_number}</Text>
                        <Text variant="caption" style={{ opacity: 0.5 }}>
                          {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '15' }]}>
                       <Text variant="overline" style={{ color: statusInfo.color, fontSize: 8 }}>{item.status.replace(/_/g, ' ')}</Text>
                    </View>
                  </View>

                  <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '10' }]} />

                  <View style={styles.orderFooter}>
                    <View>
                       <Text variant="caption" style={{ opacity: 0.6 }}>Total Amount</Text>
                       <Text variant="body1" family="price" style={{ color: colors.saffron }}>₹{item.total_amount}</Text>
                    </View>
                    <View style={styles.footerActions}>
                       <TouchableOpacity 
                         onPress={() => handleReorder(item)}
                         style={[styles.reorderBtn, { borderColor: colors.saffron }]}
                       >
                         <Text variant="caption" family="heading" style={{ color: colors.saffron }}>REORDER</Text>
                       </TouchableOpacity>
                       <TouchableOpacity 
                         style={[styles.trackBtn, { backgroundColor: colors.saffron }]}
                         onPress={() => router.push(`/order/${item.id}`)}
                       >
                         <Ionicons name="chevron-forward" size={18} color="#000" />
                       </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Card>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyLottie: { width: 300, height: 300 },
  headerBtn: { padding: 10 },
  listContent: { padding: 20 },
  orderCard: { 
    padding: 16, 
    borderRadius: 24, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderMeta: { flexDirection: 'row', alignItems: 'center' },
  statusIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  divider: { height: 1, marginVertical: 15 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerActions: { flexDirection: 'row', alignItems: 'center' },
  reorderBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, borderWidth: 1, marginRight: 10 },
  trackBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
