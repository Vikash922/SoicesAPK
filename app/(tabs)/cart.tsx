import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/useCartStore';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const { items, removeItem, updateQty, subtotal, total, discount, applyCoupon, couponCode } = useCartStore();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
    setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="cart-outline" size={80} color={colors.tabIconDefault} />
        <Text variant="h2" family="heading" style={styles.emptyText}>Your cart is empty</Text>
        <Button title="SHOP NOW" onPress={() => router.replace('/(tabs)/')} style={styles.shopBtn} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text variant="h1" family="heading">My Cart ({items.length})</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart Items */}
        {items.map((item) => (
          <View key={item.id} style={[styles.cartItem, { backgroundColor: colors.card || '#fff' }]}>
            <Image source={{ uri: item.image }} style={styles.itemImg} />
            <View style={styles.itemInfo}>
              <Text variant="body1" family="heading" numberOfLines={1}>{item.name}</Text>
              <Text variant="h3" family="price" style={{ color: colors.saffron }}>₹{item.price}</Text>
              
              <View style={styles.qtyRow}>
                <View style={styles.stepper}>
                  <TouchableOpacity onPress={() => updateQty(item.id, item.qty - 1)} style={styles.stepperBtn}>
                    <Ionicons name="remove" size={16} color={colors.text} />
                  </TouchableOpacity>
                  <AnimatedNumber value={item.qty} style={styles.qtyText} />
                  <TouchableOpacity onPress={() => updateQty(item.id, item.qty + 1)} style={styles.stepperBtn}>
                    <Ionicons name="add" size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color={colors.chili} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Spice Pairing Suggestion */}
        <View style={[styles.pairingCard, { backgroundColor: colors.cardamom + '22' }]}>
           <View style={styles.pairingHeader}>
              <Ionicons name="bulb-outline" size={20} color={colors.cardamom} />
              <Text variant="body2" family="heading" style={{ color: colors.cardamom, marginLeft: 8 }}>SMART PAIRING</Text>
           </View>
           <Text variant="caption" style={styles.pairingText}>
             Add <Text family="heading">Green Cardamom</Text> for your Saffron Biryani? Perfect match!
           </Text>
           <TouchableOpacity style={[styles.pairingBtn, { borderColor: colors.cardamom }]}>
              <Text variant="caption" family="heading" style={{ color: colors.cardamom }}>ADD FOR ₹249</Text>
           </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text variant="body2">Subtotal</Text>
            <Text variant="body1" family="heading">₹{subtotal()}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.breakdownRow}>
              <Text variant="body2">Discount ({couponCode})</Text>
              <Text variant="body1" family="heading" style={{ color: colors.chili }}>- ₹{Math.round(subtotal() * discount)}</Text>
            </View>
          )}
          <View style={styles.breakdownRow}>
            <Text variant="body2">Delivery Fee</Text>
            <Text variant="body1" family="heading" style={{ color: colors.cardamom }}>
              {subtotal() > 500 ? 'FREE' : '₹40'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '33' }]} />
          <View style={styles.breakdownRow}>
            <Text variant="h2" family="heading">Total</Text>
            <Text variant="h2" family="price" style={{ color: colors.saffron }}>₹{Math.round(total()) + (subtotal() > 500 ? 0 : 40)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.tabIconDefault + '33' }]}>
        <View>
          <Text variant="caption">Total Amount</Text>
          <Text variant="h2" family="price">₹{Math.round(total()) + (subtotal() > 500 ? 0 : 40)}</Text>
        </View>
        <Button 
          title="CHECKOUT" 
          onPress={() => router.push('/checkout')} 
          style={styles.checkoutBtn} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 15 },
  scrollContent: { paddingHorizontal: 20 },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  itemImg: { width: 80, height: 80, borderRadius: 12 },
  itemInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  stepper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.05)', 
    borderRadius: 8,
    padding: 2,
  },
  stepperBtn: { padding: 4 },
  qtyText: { marginHorizontal: 12 },
  deleteBtn: { padding: 5 },
  pairingCard: { padding: 15, borderRadius: 16, marginBottom: 25 },
  pairingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pairingText: { opacity: 0.8, marginBottom: 12, lineHeight: 18 },
  pairingBtn: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  breakdown: { marginTop: 10 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  divider: { height: 1, marginVertical: 12 },
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 35,
    borderTopWidth: 1,
  },
  checkoutBtn: { width: width * 0.5, height: 50 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyText: { marginTop: 20, marginBottom: 30 },
  shopBtn: { width: '100%' },
});
