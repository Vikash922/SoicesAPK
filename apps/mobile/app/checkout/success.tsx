import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Button } from '@/components/ui/Button';
import LottieView from 'lottie-react-native';
import Animated, { FadeIn, ScaleIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId, orderNo, total } = useLocalSearchParams<{ orderId: string, orderNo: string, total: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
        <View style={styles.iconContainer}>
          <LottieView 
            source={{ uri: 'https://assets10.lottiefiles.com/packages/lf20_S69rU9.json' }} 
            autoPlay 
            loop={false}
            style={styles.lottie}
          />
          <Animated.View entering={ScaleIn.delay(500)} style={[styles.successBadge, { backgroundColor: colors.cardamom }]}>
            <Ionicons name="checkmark" size={40} color="#fff" />
          </Animated.View>
        </View>

        <Text variant="h1" family="display" style={[styles.title, { color: colors.saffron }]}>THANK YOU!</Text>
        <Text variant="h2" family="heading" style={styles.subtitle}>Order Placed Successfully</Text>
        <Text variant="body2" style={styles.description}>
          Your order #{orderNo || 'SPC-XXXX'} has been placed and is being prepared for shipment.
        </Text>

        <View style={[styles.orderCard, { backgroundColor: colors.card || '#fff' }]}>
           <View style={styles.orderInfoRow}>
              <Text variant="caption">Order ID</Text>
              <Text variant="body2" family="heading">{orderNo}</Text>
           </View>
           <View style={styles.orderInfoRow}>
              <Text variant="caption">Total Amount</Text>
              <Text variant="body2" family="heading">₹{total}</Text>
           </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Button 
          title="TRACK ORDER" 
          onPress={() => router.replace(`/order/${orderId}`)} 
          style={styles.trackBtn}
        />
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => router.replace('/(tabs)/')}
        >
          <Text variant="body1" family="heading" style={{ color: colors.saffron }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 30 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconContainer: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  lottie: { width: '100%', height: '100%' },
  successBadge: { 
    position: 'absolute', 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: { fontSize: 32, letterSpacing: 4, marginBottom: 10 },
  subtitle: { marginBottom: 15 },
  description: { textAlign: 'center', opacity: 0.6, lineHeight: 22, paddingHorizontal: 20, marginBottom: 30 },
  orderCard: { width: '100%', padding: 20, borderRadius: 20, gap: 12 },
  orderInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footer: { gap: 15, paddingBottom: 20 },
  trackBtn: { height: 56 },
  homeBtn: { height: 56, alignItems: 'center', justifyContent: 'center' }
});
