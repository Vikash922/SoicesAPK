import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  TextInput,
  Platform
} from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useCartStore, CartItem } from '@/store/useCartStore';
import Animated, { 
  FadeInRight, 
  FadeOutLeft, 
  Layout, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
  FadeInUp,
  SlideInRight
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

function CartItemRow({ 
  item, 
  onRemove, 
  onUpdateQty 
}: { 
  item: CartItem, 
  onRemove: (id: string) => void,
  onUpdateQty: (id: string, qty: number) => void
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(110);
  const opacity = useSharedValue(1);

  const panGestureHandler = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationX < 0) {
      translateX.value = event.nativeEvent.translationX;
    }
  };

  const onGestureEnd = (event: any) => {
    if (translateX.value < -100) {
      translateX.value = withTiming(-width, { duration: 300 }, () => {
        runOnJS(onRemove)(item.id);
      });
    } else {
      translateX.value = withSpring(0);
    }
  };

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < -50 ? 1 : 0);
    return { opacity };
  });

  const qtyScale = useSharedValue(1);
  const rQtyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qtyScale.value }],
  }));

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1) return;
    qtyScale.value = withSequence(withSpring(1.2), withSpring(1));
    onUpdateQty(item.id, newQty);
  };

  return (
    <Animated.View 
      entering={FadeInRight} 
      exiting={FadeOutLeft}
      layout={Layout.springify()}
      style={styles.itemWrapper}
    >
      <Animated.View style={[styles.deleteBackground, rIconStyle, { backgroundColor: colors.chili }]}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </Animated.View>
      <PanGestureHandler onGestureEvent={panGestureHandler} onEnded={onGestureEnd}>
        <Animated.View style={[styles.cartItem, rStyle, { backgroundColor: colors.card || '#fff' }]}>
          <Image source={{ uri: item.image }} style={styles.itemImg} />
          <View style={styles.itemInfo}>
            <View style={styles.itemHeader}>
              <Text variant="body1" family="heading" numberOfLines={1} style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity onPress={() => onRemove(item.id)}>
                <Ionicons name="close" size={20} color={colors.tabIconDefault} />
              </TouchableOpacity>
            </View>
            <Text variant="caption" style={{ opacity: 0.6, marginBottom: 4 }}>{item.variant || 'Standard Pack'}</Text>
            
            <View style={styles.qtyRow}>
              <Text variant="h3" family="price" style={{ color: colors.saffron }}>₹{item.price}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity 
                  onPress={() => handleQtyChange(item.qty - 1)} 
                  style={[styles.stepperBtn, { backgroundColor: colors.background }]}
                >
                  <Ionicons name="remove" size={16} color={colors.text} />
                </TouchableOpacity>
                <Animated.View style={rQtyStyle}>
                  <Text variant="body1" family="heading" style={styles.qtyText}>{item.qty}</Text>
                </Animated.View>
                <TouchableOpacity 
                  onPress={() => handleQtyChange(item.qty + 1)} 
                  style={[styles.stepperBtn, { backgroundColor: colors.background }]}
                >
                  <Ionicons name="add" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

function CounterText({ value, style, colors }: { value: number, style?: any, colors: any }) {
  const prevValue = useRef(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = prevValue.current;
    const end = value;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
    prevValue.current = value;
  }, [value]);

  return <Text style={style}>₹{displayValue.toLocaleString()}</Text>;
}

export default function CartScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const { items, removeItem, updateQty, subtotal, total, discount, applyCoupon, couponCode } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPairing, setShowPairing] = useState(true);

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === 'SPICE20') {
      applyCoupon('SPICE20');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      applyCoupon(couponInput);
    }
    setCouponInput('');
  };

  const deliveryFee = subtotal() > 499 ? 0 : 49;
  const finalTotal = Math.round(total() + deliveryFee);

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.background }]}>
        <LottieView 
          source={require('@/assets/lottie/empty_jar.json')}
          autoPlay 
          loop 
          style={styles.emptyLottie} 
        />
        <Text variant="h2" family="heading" style={styles.emptyText}>Your spice jar is empty!</Text>
        <Text variant="body2" style={styles.emptySubtext}>Add some aroma to your life by shopping our premium collection.</Text>
        <Button title="START SHOPPING" onPress={() => router.replace('/(tabs)/')} style={styles.shopBtn} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="h1" family="heading">My Cart ({items.length})</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart Items */}
        <View style={styles.itemsList}>
          {items.map((item) => (
            <CartItemRow 
              key={item.id} 
              item={item} 
              onRemove={removeItem} 
              onUpdateQty={updateQty} 
            />
          ))}
        </View>

        {/* Spice Pairing Suggestion */}
        {showPairing && (
          <Animated.View 
            entering={SlideInRight.delay(500)}
            style={[styles.pairingCard, { backgroundColor: colors.cardamom + '15' }]}
          >
             <View style={styles.pairingHeader}>
                <View style={[styles.pairingIcon, { backgroundColor: colors.cardamom }]}>
                  <Ionicons name="flash" size={14} color="#fff" />
                </View>
                <Text variant="overline" family="badge" style={{ color: colors.cardamom }}>SMART SUGGESTION</Text>
                <TouchableOpacity onPress={() => setShowPairing(false)} style={{ marginLeft: 'auto' }}>
                  <Ionicons name="close" size={18} color={colors.cardamom} />
                </TouchableOpacity>
             </View>
             <Text variant="body2" style={styles.pairingText}>
               Add <Text family="heading">Green Cardamom (50g)</Text> for your Biryani recipe?
             </Text>
             <View style={styles.pairingActions}>
                <Text variant="h3" family="price" style={{ color: colors.cardamom }}>+₹299</Text>
                <TouchableOpacity 
                  style={[styles.addPairingBtn, { backgroundColor: colors.cardamom }]}
                  onPress={() => {
                    useCartStore.getState().addItem({
                      id: 'pairing_cardamom',
                      name: 'Green Cardamom (50g)',
                      image: 'https://images.unsplash.com/photo-1596450514735-24402770edec?q=80&w=400',
                      price: 299,
                      qty: 1
                    });
                    setShowPairing(false);
                  }}
                >
                  <Text variant="caption" family="heading" style={{ color: '#fff' }}>ADD NOW</Text>
                </TouchableOpacity>
             </View>
          </Animated.View>
        )}

        {/* Coupon Section */}
        <View style={[styles.couponSection, { backgroundColor: colors.card || '#fff' }]}>
          <Ionicons name="pricetag-outline" size={20} color={colors.saffron} />
          <TextInput 
            style={[styles.couponInput, { color: colors.text }]}
            placeholder="Apply Coupon (Try SPICE20)"
            placeholderTextColor={colors.tabIconDefault}
            value={couponInput}
            onChangeText={setCouponInput}
            autoCapitalize="characters"
          />
          <TouchableOpacity 
            onPress={handleApplyCoupon}
            disabled={!couponInput}
            style={[styles.applyBtn, { backgroundColor: couponInput ? colors.saffron : colors.tabIconDefault + '33' }]}
          >
            <Text variant="caption" family="heading" style={{ color: couponInput ? '#000' : colors.tabIconDefault }}>APPLY</Text>
          </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
        <Animated.View entering={FadeInUp.delay(300)} style={[styles.breakdown, { backgroundColor: colors.card || '#fff' }]}>
          <Text variant="overline" family="badge" style={styles.breakdownTitle}>PRICE DETAILS</Text>
          
          <View style={styles.breakdownRow}>
            <Text variant="body2" style={{ opacity: 0.7 }}>Subtotal ({items.length} items)</Text>
            <CounterText value={subtotal()} style={styles.breakdownVal} colors={colors} />
          </View>

          {discount > 0 && (
            <View style={styles.breakdownRow}>
              <Text variant="body2" style={{ opacity: 0.7 }}>Discount ({couponCode})</Text>
              <Text variant="body2" family="heading" style={{ color: colors.cardamom }}>- ₹{Math.round(subtotal() * discount)}</Text>
            </View>
          )}

          <View style={styles.breakdownRow}>
            <Text variant="body2" style={{ opacity: 0.7 }}>Delivery Fee</Text>
            <Text variant="body2" family="heading" style={{ color: deliveryFee === 0 ? colors.cardamom : colors.text }}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </Text>
          </View>

          {deliveryFee > 0 && (
            <Text variant="caption" style={{ color: colors.saffron, marginBottom: 10 }}>
              Add ₹{500 - subtotal()} more for FREE delivery
            </Text>
          )}

          <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '22' }]} />
          
          <View style={styles.totalRow}>
            <Text variant="h2" family="heading">Total Amount</Text>
            <CounterText value={finalTotal} style={[styles.totalVal, { color: colors.saffron }]} colors={colors} />
          </View>

          <View style={[styles.savingsBadge, { backgroundColor: colors.cardamom + '15' }]}>
            <Text variant="caption" family="heading" style={{ color: colors.cardamom }}>
              You are saving ₹{Math.round(subtotal() * discount) + (deliveryFee === 0 ? 49 : 0)} on this order
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: 150 }} />
      </ScrollView>

      {/* Confetti Overlay */}
      {showConfetti && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <LottieView 
            source={require('@/assets/lottie/spice_confetti.json')}
            autoPlay 
            loop={false} 
            style={styles.confetti} 
          />
        </View>
      )}

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.tabIconDefault + '22' }]}>
        <View style={styles.priceInfo}>
          <CounterText value={finalTotal} style={[styles.bottomPrice, { color: colors.text }]} colors={colors} />
          <TouchableOpacity onPress={() => {}}>
             <Text variant="caption" style={{ color: colors.saffron, textDecorationLine: 'underline' }}>View Details</Text>
          </TouchableOpacity>
        </View>
        <Button 
          title="PROCEED TO CHECKOUT" 
          onPress={() => router.push('/checkout')} 
          style={styles.checkoutBtn} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { marginRight: 15 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  itemsList: { marginBottom: 20 },
  itemWrapper: { marginBottom: 15, position: 'relative' },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    width: '100%',
    height: '100%',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 30,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  itemImg: { width: 85, height: 85, borderRadius: 12, backgroundColor: '#f5f5f5' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { flex: 1, marginRight: 10 },
  qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  stepper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.05)', 
    borderRadius: 10,
    padding: 3,
  },
  stepperBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  qtyText: { marginHorizontal: 12, minWidth: 20, textAlign: 'center' },
  pairingCard: { padding: 16, borderRadius: 16, marginBottom: 25 },
  pairingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  pairingIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  pairingText: { opacity: 0.8, marginBottom: 15, lineHeight: 20 },
  pairingActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addPairingBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  couponSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  couponInput: { flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '600' },
  applyBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  breakdown: { padding: 20, borderRadius: 20, marginBottom: 30 },
  breakdownTitle: { opacity: 0.5, marginBottom: 20, letterSpacing: 1.5 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  breakdownVal: { fontWeight: '600' },
  divider: { height: 1, marginBottom: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalVal: { fontSize: 24, fontWeight: 'bold' },
  savingsBadge: { padding: 12, borderRadius: 12, alignItems: 'center' },
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    borderTopWidth: 1,
    zIndex: 10,
  },
  priceInfo: { flex: 1 },
  bottomPrice: { fontSize: 22, fontWeight: 'bold' },
  checkoutBtn: { width: width * 0.55, height: 54 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyLottie: { width: 250, height: 250 },
  emptyText: { marginTop: -20, marginBottom: 10, textAlign: 'center' },
  emptySubtext: { textAlign: 'center', opacity: 0.6, marginBottom: 40, lineHeight: 22 },
  shopBtn: { width: '100%', height: 56 },
  confetti: { width: '100%', height: '100%' },
});
