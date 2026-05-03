import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ORDER_TIMELINE = [
  { id: '1', title: 'Order Placed', time: '10:30 AM', status: 'completed' },
  { id: '2', title: 'Order Confirmed', time: '10:45 AM', status: 'completed' },
  { id: '3', title: 'Packed', time: '11:15 AM', status: 'completed' },
  { id: '4', title: 'Out for Delivery', time: 'Pending', status: 'active' },
  { id: '5', title: 'Delivered', time: 'Pending', status: 'upcoming' },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: `Order #SPC-2847`,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Mock Map View */}
        <View style={styles.mapPlaceholder}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800' }} 
            style={styles.mapImg}
          />
          <View style={styles.deliveryStatusCard}>
             <View style={[styles.pulseDot, { backgroundColor: colors.saffron }]} />
             <View style={{ marginLeft: 12 }}>
                <Text variant="caption" family="heading" style={{ color: colors.saffron }}>OUT FOR DELIVERY</Text>
                <Text variant="body2" family="heading">ETA: 25 mins</Text>
             </View>
             <TouchableOpacity style={[styles.callBtn, { backgroundColor: colors.saffron }]}>
                <Ionicons name="call" size={18} color="#000" />
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text variant="h3" family="heading" style={styles.sectionTitle}>Track Your Order</Text>
          
          {/* Vertical Timeline */}
          <View style={styles.timelineContainer}>
            {ORDER_TIMELINE.map((step, index) => (
              <TimelineItem 
                key={step.id} 
                {...step} 
                isLast={index === ORDER_TIMELINE.length - 1} 
                colors={colors}
              />
            ))}
          </View>

          <View style={styles.divider} />

          {/* Order Summary */}
          <Text variant="h3" family="heading" style={styles.sectionTitle}>Order Summary</Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.card || '#fff' }]}>
            <View style={styles.itemRow}>
               <Image source={{ uri: 'https://images.unsplash.com/photo-1599590984817-0dc18393593e?q=80&w=200' }} style={styles.itemThumb} />
               <View style={styles.itemInfo}>
                  <Text variant="body2" family="heading">Kashmiri Saffron (1g)</Text>
                  <Text variant="caption">Qty: 1 • ₹499</Text>
               </View>
            </View>
            <View style={styles.itemRow}>
               <Image source={{ uri: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=200' }} style={styles.itemThumb} />
               <View style={styles.itemInfo}>
                  <Text variant="body2" family="heading">Turmeric Powder (200g)</Text>
                  <Text variant="caption">Qty: 2 • ₹258</Text>
               </View>
            </View>
            <View style={[styles.totalRow, { borderTopColor: colors.tabIconDefault + '20' }]}>
               <Text variant="body1" family="heading">Total Amount</Text>
               <Text variant="h3" family="price" style={{ color: colors.saffron }}>₹897</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.helpBtn, { borderColor: colors.tabIconDefault }]}
            onPress={() => {}}
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.text} />
            <Text variant="body2" family="heading" style={{ marginLeft: 8 }}>Need help with this order?</Text>
          </TouchableOpacity>

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </View>
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
            backgroundColor: isCompleted ? colors.cardamom : (isActive ? colors.saffron : colors.tabIconDefault + '40'),
            borderColor: isActive ? colors.saffron + '40' : 'transparent',
            borderWidth: isActive ? 4 : 0
          }
        ]}>
          {isCompleted && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
        {!isLast && (
          <View style={[
            styles.timelineLine, 
            { backgroundColor: isCompleted ? colors.cardamom : colors.tabIconDefault + '40' }
          ]} />
        )}
      </View>
      <View style={styles.timelineRight}>
        <Text variant="body2" family="heading" style={{ opacity: isCompleted || isActive ? 1 : 0.4 }}>{title}</Text>
        <Text variant="caption" style={{ opacity: 0.5 }}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBtn: { padding: 10 },
  mapPlaceholder: { width: '100%', height: 300, backgroundColor: '#eee' },
  mapImg: { width: '100%', height: '100%' },
  deliveryStatusCard: { 
    position: 'absolute', 
    bottom: 20, 
    left: 20, 
    right: 20, 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    padding: 15, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    elevation: 4,
  },
  pulseDot: { width: 12, height: 12, borderRadius: 6 },
  callBtn: { marginLeft: 'auto', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'transparent' },
  sectionTitle: { marginBottom: 20 },
  timelineContainer: { paddingLeft: 10 },
  timelineItem: { flexDirection: 'row', height: 70 },
  timelineLeft: { alignItems: 'center', width: 30, marginRight: 15 },
  timelineDot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  timelineLine: { width: 2, flex: 1, marginTop: -5 },
  timelineRight: { flex: 1, paddingTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 24 },
  summaryCard: { padding: 20, borderRadius: 20, gap: 15 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemThumb: { width: 40, height: 40, borderRadius: 8 },
  itemInfo: { marginLeft: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTopWidth: 1 },
  helpBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    marginTop: 24 
  },
});
