import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  TextInput,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateOrder } from '@/hooks/useOrders';
import Animated, { 
  FadeInRight, 
  FadeInDown,
  Layout,
  useAnimatedStyle,
  withTiming,
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const STEPS = ['Address', 'Delivery', 'Payment', 'Review'];

const SAVED_ADDRESSES = [
  { id: '1', type: 'Home', name: 'John Doe', address: '123 Spice Lane, HSR Layout, Mumbai', state: 'Maharashtra - 400001', phone: '+91 98xxx xxxxx' },
  { id: '2', type: 'Office', name: 'John Doe', address: '456 Tech Park, Powai, Mumbai', state: 'Maharashtra - 400076', phone: '+91 98xxx xxxxx' },
];

const DATES = [
  { id: 'd1', label: 'Today', sub: '3 May' },
  { id: 'd2', label: 'Tomorrow', sub: '4 May' },
  { id: 'd3', label: 'Mon', sub: '5 May' },
  { id: 'd4', label: 'Tue', sub: '6 May' },
];

const TIMES = ['9AM - 12PM', '1PM - 4PM', '5PM - 8PM'];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI (GPay/PhonePe)', icon: 'logo-google', color: '#4285F4' },
  { id: 'card', label: 'Credit/Debit Card', icon: 'card-outline', color: '#E2B714' },
  { id: 'nb', label: 'Net Banking', icon: 'globe-outline', color: '#2E8B57' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline', color: '#E8590C' },
  { id: 'wallet', label: 'SpiceCart Wallet (₹200)', icon: 'wallet-outline', color: '#8B4513' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { items, total, subtotal } = useCartStore();
  const { user } = useAuthStore();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const finalAmount = Math.round(total() + (subtotal() > 499 ? 0 : 49));

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [selectedDate, setSelectedDate] = useState('d1');
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreed, setAgreed] = useState(true);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!user) {
        router.push('/(auth)/login');
        return;
      }

      createOrder({
        orderData: {
          user_id: user.id,
          total_amount: finalAmount,
          items_count: items.length,
        },
        items: items.map(i => ({
          product_id: i.id,
          quantity: i.qty,
          price: i.price
        }))
      }, {
        onSuccess: (order) => {
          router.replace({
            pathname: '/checkout/success',
            params: { orderId: order.id, orderNo: order.order_number, total: finalAmount }
          });
        }
      });
    }
  };

  const renderStepIndicator = () => (
    <View style={[styles.stepIndicatorContainer, { backgroundColor: colors.background }]}>
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <View style={styles.stepItem}>
            <View style={[
              styles.stepCircle, 
              { 
                backgroundColor: i <= currentStep ? colors.saffron : colors.tabIconDefault + '22',
                borderColor: i <= currentStep ? colors.saffron : 'transparent'
              }
            ]}>
              {i < currentStep ? (
                <Ionicons name="checkmark" size={14} color="#000" />
              ) : (
                <Text style={{ color: i <= currentStep ? '#000' : colors.text, fontSize: 10, fontWeight: 'bold' }}>{i + 1}</Text>
              )}
            </View>
            <Text variant="overline" style={[styles.stepLabel, { color: i <= currentStep ? colors.text : colors.tabIconDefault, opacity: i <= currentStep ? 1 : 0.5 }]}>{step}</Text>
          </View>
          {i < STEPS.length - 1 && (
            <View style={[
              styles.stepLine, 
              { backgroundColor: i < currentStep ? colors.saffron : colors.tabIconDefault + '22' }
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderAddressStep = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <Text variant="overline" family="badge" style={{ color: colors.saffron }}>STEP 1: DELIVERY ADDRESS</Text>
      </View>
      {SAVED_ADDRESSES.map((addr) => (
        <TouchableOpacity 
          key={addr.id} 
          onPress={() => setSelectedAddress(addr.id)}
          activeOpacity={0.8}
          style={[
            styles.addressCard, 
            { 
              backgroundColor: colors.card || '#fff', 
              borderColor: selectedAddress === addr.id ? colors.saffron : 'transparent',
              borderWidth: 1.5
            }
          ]}
        >
          <View style={styles.addressHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={addr.type === 'Home' ? 'home-outline' : 'business-outline'} size={18} color={colors.saffron} />
              <Text variant="body1" family="heading" style={{ marginLeft: 8 }}>{addr.type}</Text>
            </View>
            <View style={[styles.radio, { borderColor: selectedAddress === addr.id ? colors.saffron : colors.tabIconDefault }]}>
              {selectedAddress === addr.id && <View style={[styles.radioInner, { backgroundColor: colors.saffron }]} />}
            </View>
          </View>
          <View style={styles.addressBody}>
            <Text variant="body1" family="heading" style={{ marginTop: 8 }}>{addr.name}</Text>
            <Text variant="body2" style={{ opacity: 0.6, marginTop: 4 }}>{addr.address}</Text>
            <Text variant="body2" style={{ opacity: 0.6 }}>{addr.state}</Text>
            <Text variant="body2" style={{ opacity: 0.8, marginTop: 8 }}>Mobile: {addr.phone}</Text>
          </View>
          <View style={styles.addressFooter}>
            <TouchableOpacity><Text variant="caption" family="heading" style={{ color: colors.saffron }}>Edit</Text></TouchableOpacity>
            <View style={[styles.dividerVertical, { backgroundColor: colors.tabIconDefault + '33' }]} />
            <TouchableOpacity><Text variant="caption" family="heading" style={{ color: colors.saffron }}>Delete</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={[styles.addBtn, { borderColor: colors.saffron, backgroundColor: colors.saffron + '10' }]}>
        <Ionicons name="add" size={24} color={colors.saffron} />
        <Text variant="body2" family="heading" style={{ color: colors.saffron, marginLeft: 8 }}>ADD NEW ADDRESS</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderDeliveryStep = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <Text variant="overline" family="badge" style={{ color: colors.saffron }}>STEP 2: DELIVERY SLOT</Text>
      </View>
      
      <View style={[styles.slotContainer, { backgroundColor: colors.card || '#fff' }]}>
        <Text variant="overline" style={styles.subTitle}>SELECT DATE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
          {DATES.map((date) => (
            <TouchableOpacity 
              key={date.id} 
              onPress={() => setSelectedDate(date.id)}
              style={[
                styles.dateCard, 
                { 
                  backgroundColor: selectedDate === date.id ? colors.saffron : colors.background,
                  borderColor: selectedDate === date.id ? colors.saffron : 'transparent',
                }
              ]}
            >
              <Text variant="body2" family="heading" style={{ color: selectedDate === date.id ? '#000' : colors.text }}>{date.label}</Text>
              <Text variant="caption" style={{ color: selectedDate === date.id ? '#000' : colors.text, opacity: 0.7 }}>{date.sub}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '22', marginVertical: 20 }]} />

        <Text variant="overline" style={styles.subTitle}>SELECT TIME</Text>
        <View style={styles.timeGrid}>
          {TIMES.map((time) => (
            <TouchableOpacity 
              key={time} 
              onPress={() => setSelectedTime(time)}
              style={[
                styles.timeCard, 
                { 
                  backgroundColor: selectedTime === time ? colors.saffron : colors.background,
                  borderColor: selectedTime === time ? colors.saffron : 'transparent',
                }
              ]}
            >
              <Ionicons name="time-outline" size={16} color={selectedTime === time ? '#000' : colors.text} style={{ marginRight: 8 }} />
              <Text variant="body2" family="heading" style={{ color: selectedTime === time ? '#000' : colors.text }}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={[styles.infoBox, { backgroundColor: colors.cardamom + '15' }]}>
        <Ionicons name="leaf-outline" size={18} color={colors.cardamom} />
        <Text variant="caption" style={{ color: colors.cardamom, marginLeft: 10, flex: 1 }}>
          Our delivery partners follow eco-friendly routes to reduce carbon footprint.
        </Text>
      </View>
    </Animated.View>
  );

  const renderPaymentStep = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <Text variant="overline" family="badge" style={{ color: colors.saffron }}>STEP 3: PAYMENT</Text>
      </View>
      
      <View style={[styles.paymentList, { backgroundColor: colors.card || '#fff' }]}>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity 
            key={method.id} 
            onPress={() => setPaymentMethod(method.id)}
            style={styles.paymentOption}
          >
            <View style={[styles.methodIcon, { backgroundColor: method.color + '15' }]}>
               <Ionicons name={method.icon as any} size={20} color={method.color} />
            </View>
            <Text variant="body1" family="heading" style={{ flex: 1, marginLeft: 15 }}>{method.label}</Text>
            <View style={[styles.radio, { borderColor: paymentMethod === method.id ? colors.saffron : colors.tabIconDefault }]}>
              {paymentMethod === method.id && <View style={[styles.radioInner, { backgroundColor: colors.saffron }]} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderReviewStep = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContent}>
      <View style={styles.sectionHeader}>
        <Text variant="overline" family="badge" style={{ color: colors.saffron }}>FINAL REVIEW</Text>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.card || '#fff' }]}>
        <Text variant="overline" style={styles.subTitle}>ORDER SUMMARY</Text>
        <View style={styles.summaryItems}>
          {items.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text variant="body2" style={{ flex: 1 }}>{item.name} x {item.qty}</Text>
              <Text variant="body2" family="heading">₹{item.price * item.qty}</Text>
            </View>
          ))}
          {items.length > 3 && (
            <Text variant="caption" style={{ opacity: 0.5 }}>+ {items.length - 3} more items</Text>
          )}
        </View>
        <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '22', marginVertical: 15 }]} />
        <View style={styles.summaryRow}>
          <Text variant="body1" family="heading">Total Payable</Text>
          <Text variant="h2" family="price" style={{ color: colors.saffron }}>₹{finalAmount}</Text>
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.card || '#fff', marginTop: 15 }]}>
        <Text variant="overline" style={styles.subTitle}>DELIVERY TO</Text>
        <Text variant="body2" family="heading">{SAVED_ADDRESSES.find(a => a.id === selectedAddress)?.type}</Text>
        <Text variant="caption" numberOfLines={1}>{SAVED_ADDRESSES.find(a => a.id === selectedAddress)?.address}</Text>
        <View style={[styles.divider, { backgroundColor: colors.tabIconDefault + '22', marginVertical: 12 }]} />
        <Text variant="overline" style={styles.subTitle}>DELIVERY SLOT</Text>
        <Text variant="body2" family="heading">{DATES.find(d => d.id === selectedDate)?.label}, {selectedTime}</Text>
      </View>

      <TouchableOpacity 
        style={styles.termsRow} 
        onPress={() => setAgreed(!agreed)}
      >
        <Ionicons name={agreed ? "checkbox" : "square-outline"} size={22} color={agreed ? colors.saffron : colors.tabIconDefault} />
        <Text variant="caption" style={{ marginLeft: 10, flex: 1 }}>
          I agree to the <Text variant="caption" family="heading" style={{ color: colors.saffron }}>Terms & Conditions</Text> and <Text variant="caption" family="heading" style={{ color: colors.saffron }}>Privacy Policy</Text>.
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Checkout',
          headerTitleStyle: { fontFamily: 'Poppins-Bold' },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.back()} style={styles.headerBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />

      {renderStepIndicator()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {currentStep === 0 && renderAddressStep()}
        {currentStep === 1 && renderDeliveryStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderReviewStep()}
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.tabIconDefault + '22' }]}>
        <View style={styles.footerInfo}>
          <Text variant="caption" style={{ opacity: 0.6 }}>Total Amount</Text>
          <Text variant="h2" family="price" style={{ color: colors.text }}>₹{finalAmount}</Text>
        </View>
        <Button 
          title={currentStep === STEPS.length - 1 ? "PLACE ORDER" : "CONTINUE"} 
          onPress={handleNext}
          style={styles.nextBtn}
          disabled={(currentStep === 3 && !agreed) || isCreatingOrder}
          loading={isCreatingOrder}
          icon={currentStep === STEPS.length - 1 && !isCreatingOrder ? <Ionicons name="lock-closed" size={18} color="#000" style={{ marginRight: 8 }} /> : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBtn: { padding: 8, marginLeft: 10 },
  stepIndicatorContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 20,
    paddingHorizontal: 30,
    zIndex: 10,
  },
  stepItem: { alignItems: 'center' },
  stepCircle: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepLabel: { fontSize: 7, marginTop: 4, letterSpacing: 0.5 },
  stepLine: { flex: 1, height: 2, marginHorizontal: 8, marginTop: -15 },
  scrollContent: { paddingHorizontal: 20 },
  stepContent: { flex: 1 },
  sectionHeader: { marginBottom: 15, marginTop: 5 },
  addressCard: { 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressBody: { paddingBottom: 15 },
  addressFooter: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(0,0,0,0.05)' 
  },
  dividerVertical: { width: 1, height: 12, mx: 15, opacity: 0.2 },
  radio: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  addBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 18, 
    borderRadius: 20, 
    borderWidth: 1.5, 
    borderStyle: 'dashed',
    marginTop: 5
  },
  slotContainer: { padding: 20, borderRadius: 24, marginBottom: 20 },
  subTitle: { opacity: 0.5, marginBottom: 15, letterSpacing: 1 },
  dateList: { paddingBottom: 5 },
  dateCard: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, marginRight: 12, alignItems: 'center', minWidth: 80 },
  timeGrid: { gap: 12 },
  timeCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    borderRadius: 16,
  },
  infoBox: { 
    flexDirection: 'row', 
    padding: 15, 
    borderRadius: 16, 
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentList: { padding: 10, borderRadius: 24 },
  paymentOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 16, 
    marginBottom: 5 
  },
  methodIcon: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  summaryCard: { padding: 20, borderRadius: 24 },
  summaryItems: { gap: 10 },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  termsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 25, 
    paddingHorizontal: 10 
  },
  footer: { 
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 25, 
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  footerInfo: { flex: 1 },
  nextBtn: { width: width * 0.55, height: 56 },
  divider: { height: 1, width: '100%' },
});
