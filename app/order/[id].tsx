import React, { useEffect, useMemo, useRef } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Image, 
  ActivityIndicator,
  Platform,
  Linking
} from 'react-native';
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
  FadeInUp,
  FadeInDown,
  Layout
} from 'react-native-reanimated';
import { useOrder } from '@/hooks/useOrders';
import { Card } from '@/components/ui/Card';
import { BlurView } from 'expo-blur';
import { SpiceMapView } from '@/components/spice/SpiceMapView';

const { width, height } = Dimensions.get('window');

const STATUS_STEPS = [
  { id: 'pending', title: 'Order Placed', icon: 'receipt-outline' },
  { id: 'confirmed', title: 'Confirmed', icon: 'checkmark-circle-outline' },
  { id: 'packed', title: 'Packed', icon: 'cube-outline' },
  { id: 'out_for_delivery', title: 'On the Way', icon: 'bicycle-outline' },
  { id: 'delivered', title: 'Arrived', icon: 'home-outline' },
];

function TimelineItem({ title, status, isLast, icon, colors }: any) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[
          styles.timelineDot, 
          { 
            backgroundColor: isCompleted ? colors.cardamom : (isActive ? colors.saffron : colors.tabIconDefault + '22'),
            borderColor: isActive ? colors.saffron : 'transparent',
            borderWidth: isActive ? 4 : 0
          }
        ]}>
          {isCompleted && <Ionicons name="checkmark" size={10} color="#fff" />}
        </View>
        {!isLast && (
          <View style={[
            styles.timelineLine, 
            { backgroundColor: isCompleted ? colors.cardamom : colors.tabIconDefault + '22' }
          ]} />
        )}
      </View>
      <View style={styles.timelineRight}>
        <View style={styles.timelineTextContainer}>
          <Ionicons 
            name={icon as any} 
            size={18} 
            color={isCompleted || isActive ? colors.text : colors.tabIconDefault} 
            style={{ marginRight: 12, opacity: isCompleted || isActive ? 1 : 0.5 }}
          />
          <Text 
            variant="body2" 
            family="heading" 
            style={{ color: isCompleted || isActive ? colors.text : colors.tabIconDefault }}
          >
            {title}
          </Text>
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
  const isDark = colorScheme === 'dark';

  const { data: order, isLoading } = useOrder(id as string);

  const timelineSteps = useMemo(() => {
    if (!order) return [];
    const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === order.status);
    return STATUS_STEPS.map((step, index) => ({
      ...step,
      status: index < currentStatusIndex ? 'completed' : (index === currentStatusIndex ? 'active' : 'upcoming'),
    }));
  }, [order]);

  if (isLoading) return <View style={styles.centered}><ActivityIndicator color={colors.saffron} /></View>;
  if (!order) return <View style={styles.centered}><Text>Order not found</Text></View>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerTitle: `Tracking Order`,
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />

      <View style={styles.mapWrapper}>
        <SpiceMapView />
        <BlurView intensity={isDark ? 40 : 80} tint={isDark ? 'dark' : 'light'} style={styles.etaOverlay}>
          <Text variant="caption" family="badge" style={{ color: colors.saffron, letterSpacing: 2 }}>ESTIMATED ARRIVAL</Text>
          <Text variant="display2" family="price" style={styles.etaTime}>{order.delivery_eta || '24 MINS'}</Text>
        </BlurView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
      >
        {/* Delivery Partner Card */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <Card glass intensity={10} style={styles.partnerCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200' }} 
              style={styles.avatar} 
            />
            <View style={styles.partnerInfo}>
              <Text variant="body1" family="heading">Rohan Sharma</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.turmeric} />
                <Text variant="caption" style={{ marginLeft: 4 }}>4.9 • Delivery Partner</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.callBtn, { backgroundColor: colors.cardamom }]}
              onPress={() => Linking.openURL('tel:+919876543210')}
            >
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
          </Card>
        </Animated.View>

        {/* Floating Status Bar */}
        <View style={styles.statusSection}>
           <Card style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Text variant="body1" family="heading">Order Status</Text>
                <Text variant="caption" style={{ color: colors.saffron }}>#{order.order_number}</Text>
              </View>
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
           </Card>
        </View>

        {/* Order Items Summary */}
        <View style={styles.itemsSection}>
           <Text variant="overline" family="badge" style={styles.sectionTitle}>YOUR SPICE BOX</Text>
           {order.order_items?.map((item: any) => (
             <View key={item.id} style={styles.itemRow}>
                <Image source={{ uri: item.products.image }} style={styles.itemThumb} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text variant="body2" family="heading">{item.products.name}</Text>
                  <Text variant="caption" style={{ opacity: 0.6 }}>Qty: {item.quantity}</Text>
                </View>
                <Text variant="body2" family="price">₹{item.price * item.quantity}</Text>
             </View>
           ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center', marginLeft: 15, marginTop: Platform.OS === 'ios' ? 0 : 40 },
  mapWrapper: { height: height * 0.45, width: '100%' },
  etaOverlay: { 
    position: 'absolute', 
    bottom: 30, 
    left: 20, 
    right: 20, 
    padding: 20, 
    borderRadius: 24, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  etaTime: { color: '#fff', fontSize: 32, marginTop: 4 },
  scrollContent: { padding: 20, marginTop: -20 },
  partnerCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  partnerInfo: { flex: 1, marginLeft: 15 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  callBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  statusSection: { marginBottom: 30 },
  statusCard: { borderRadius: 24, padding: 20 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  timeline: { paddingLeft: 5 },
  timelineItem: { flexDirection: 'row', minHeight: 50 },
  timelineLeft: { alignItems: 'center', width: 20, marginRight: 20 },
  timelineDot: { width: 14, height: 14, borderRadius: 7, zIndex: 1 },
  timelineLine: { width: 2, flex: 1, marginVertical: 4 },
  timelineRight: { flex: 1, paddingBottom: 15 },
  timelineTextContainer: { flexDirection: 'row', alignItems: 'center' },
  itemsSection: { marginBottom: 30 },
  sectionTitle: { opacity: 0.5, marginBottom: 15, letterSpacing: 1.5 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  itemThumb: { width: 44, height: 44, borderRadius: 8 },
});
