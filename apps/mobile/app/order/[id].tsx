import React, { useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
} from 'react-native-reanimated';
import { useOrder } from '@/hooks/useOrders';

const { width } = Dimensions.get('window');

const STATUS_STEPS = [
  { id: 'pending', title: 'Order Placed' },
  { id: 'confirmed', title: 'Confirmed' },
  { id: 'packed', title: 'Packed' },
  { id: 'out_for_delivery', title: 'Out for Delivery' },
  { id: 'delivered', title: 'Delivered' },
];

function PulsingDot({ color }: { color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(withTiming(2.5, { duration: 1500 }), -1, false);
    opacity.value = withRepeat(withTiming(0, { duration: 1500 }), -1, false);
  }, []);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.pulse, { backgroundColor: color }, rStyle]} />
  );
}

function TimelineItem({ title, time, status, isLast, colors }: any) {
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[
          styles.timelineDot, 
          { 
            backgroundColor: isCompleted ? colors.cardamom : (isActive ? colors.saffron : colors.tabIconDefault + '22'),
          }
        ]}>
          {isCompleted ? (
            <Ionicons name="checkmark" size={10} color="#fff" />
          ) : isActive ? (
            <View style={[styles.activeDotInner, { backgroundColor: '#000' }]} />
          ) : null}
        </View>
        {!isLast && (
          <View style={[
            styles.timelineLine, 
            { backgroundColor: isCompleted ? colors.cardamom : colors.tabIconDefault + '22' }
          ]} />
        )}
      </View>
      <View style={styles.timelineRight}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="body2" family="heading" style={{ color: isCompleted || isActive ? colors.text : colors.tabIconDefault }}>
            {title}
          </Text>
          <Text variant="caption" style={{ opacity: 0.5 }}>{time}</Text>
        </View>
      </View>
    </View>
  );
}

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { data: order, isLoading } = useOrder(id as string);

  const timelineSteps = useMemo(() => {
    if (!order) return [];
    
    const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === order.status);
    
    return STATUS_STEPS.map((step, index) => {
      let status: 'completed' | 'active' | 'upcoming' = 'upcoming';
      if (index < currentStatusIndex) status = 'completed';
      else if (index === currentStatusIndex) status = 'active';
      
      return {
        ...step,
        status,
        time: index === 0 ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (status === 'completed' ? 'Done' : ''),
      };
    });
  }, [order]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.saffron} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: `Order #${order.order_number}`,
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stylized Map View */}
        <View style={[styles.mapContainer, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : colors.card }]}>
          <View style={styles.mapPathContainer}>
             <View style={[styles.pathLine, { backgroundColor: colors.tabIconDefault + '33' }]} />
             <View style={[styles.activePath, { 
               width: order.status === 'delivered' ? '100%' : (order.status === 'out_for_delivery' ? '75%' : '25%'), 
               backgroundColor: colors.saffron 
             }]} />
             
             <View style={[styles.pathPoint, styles.pointStore, { backgroundColor: colors.cardamom }]}>
                <Ionicons name="business" size={12} color="#fff" />
                <Text variant="caption" style={styles.pointLabel}>Store</Text>
             </View>
             
             {order.status !== 'delivered' && (
               <View style={[styles.pathPoint, styles.pointCurrent, { 
                 backgroundColor: colors.saffron, 
                 left: order.status === 'out_for_delivery' ? '75%' : '25%' 
               }]}>
                  <Ionicons name="bicycle" size={12} color="#000" />
                  <PulsingDot color={colors.saffron} />
               </View>
             )}
             
             <View style={[styles.pathPoint, styles.pointYou, { backgroundColor: colors.chili }]}>
                <Ionicons name="home" size={12} color="#fff" />
                <Text variant="caption" style={styles.pointLabelRight}>You</Text>
             </View>
          </View>
          <Text variant="caption" family="heading" style={[styles.etaText, { color: colors.saffron }]}>
            {order.status === 'delivered' ? 'DELIVERED' : `ETA: ${order.delivery_eta || '30 mins'}`}
          </Text>
        </View>

        <View style={styles.timelineSection}>
          <Text variant="overline" family="badge" style={styles.sectionTitle}>ORDER TIMELINE</Text>
          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <TimelineItem 
                key={step.id} 
                {...step} 
                isLast={index === timelineSteps.length - 1} 
                colors={colors}
              />
            ))}
          </View>
        </View>

        {order.order_items && (
          <View style={styles.itemsSection}>
            <Text variant="overline" family="badge" style={styles.sectionTitle}>YOUR ITEMS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsList}>
              {order.order_items.map((item: any) => (
                <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.card || '#fff' }]}>
                  <Image source={{ uri: item.products.image }} style={styles.itemImg} />
                  <Text variant="caption" family="heading" numberOfLines={1} style={styles.itemName}>{item.products.name.split(' ')[0]}</Text>
                  <Text variant="caption" style={{ opacity: 0.5 }}>x{item.quantity}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.tabIconDefault }]}>
             <Ionicons name="call-outline" size={20} color={colors.text} />
             <Text variant="body1" family="heading" style={styles.actionBtnText}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.tabIconDefault, marginLeft: 15 }]}>
             <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
             <Text variant="body1" family="heading" style={styles.actionBtnText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBtn: { padding: 10 },
  scrollContent: { padding: 20 },
  mapContainer: { 
    height: 180, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  mapPathContainer: { width: '80%', height: 2, position: 'relative' },
  pathLine: { position: 'absolute', width: '100%', height: 2, borderRadius: 1 },
  activePath: { position: 'absolute', height: 2, borderRadius: 1 },
  pathPoint: { 
    position: 'absolute', 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    top: -13, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pointStore: { left: -14 },
  pointCurrent: { zIndex: 2 },
  pointYou: { right: -14 },
  pointLabel: { position: 'absolute', top: 32, fontSize: 10, opacity: 0.6 },
  pointLabelRight: { position: 'absolute', top: 32, fontSize: 10, opacity: 0.6 },
  pulse: { position: 'absolute', width: 28, height: 28, borderRadius: 14, zIndex: -1 },
  etaText: { marginTop: 60, letterSpacing: 1 },
  timelineSection: { marginBottom: 30 },
  sectionTitle: { opacity: 0.5, marginBottom: 20, letterSpacing: 1.5 },
  timeline: { paddingLeft: 10 },
  timelineItem: { flexDirection: 'row', minHeight: 60 },
  timelineLeft: { alignItems: 'center', width: 20, marginRight: 20 },
  timelineDot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  activeDotInner: { width: 6, height: 6, borderRadius: 3 },
  timelineLine: { width: 2, flex: 1, marginVertical: 4 },
  timelineRight: { flex: 1, paddingBottom: 20 },
  itemsSection: { marginBottom: 30 },
  itemsList: { gap: 12 },
  itemCard: { width: 80, padding: 8, borderRadius: 16, alignItems: 'center' },
  itemImg: { width: 60, height: 60, borderRadius: 10, marginBottom: 8 },
  itemName: { fontSize: 10 },
  actionButtons: { flexDirection: 'row', marginBottom: 40 },
  actionBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    borderRadius: 16, 
    borderWidth: 1 
  },
  actionBtnText: { marginLeft: 10 },
});
