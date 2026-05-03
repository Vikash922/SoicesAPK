import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Button } from '@/components/ui/Button';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const STEPS = ['Address', 'Delivery', 'Payment'];

const SAVED_ADDRESSES = [
  { id: '1', type: 'Home', name: 'John Doe', address: '123, Spice Garden, HSR Layout, Mumbai, 400001', phone: '+91 98765 43210' },
  { id: '2', type: 'Work', name: 'John Doe', address: '456, Tech Park, Powai, Mumbai, 400076', phone: '+91 98765 43210' },
];

const SLOTS = [
  { id: '1', date: 'Today, 3 May', times: ['9AM - 12PM', '1PM - 4PM', '5PM - 8PM'] },
  { id: '2', date: 'Tomorrow, 4 May', times: ['9AM - 12PM', '1PM - 4PM', '5PM - 8PM'] },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [selectedDate, setSelectedDate] = useState('1');
  const [selectedTime, setSelectedTime] = useState('');

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/checkout/success');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <View style={styles.stepItem}>
            <View style={[
              styles.stepCircle, 
              { backgroundColor: i <= currentStep ? colors.saffron : colors.tabIconDefault + '40' }
            ]}>
              {i < currentStep ? (
                <Ionicons name="checkmark" size={16} color="#000" />
              ) : (
                <Text style={{ color: i <= currentStep ? '#000' : colors.text, fontSize: 12, fontWeight: 'bold' }}>{i + 1}</Text>
              )}
            </View>
            <Text variant="overline" style={[styles.stepLabel, { opacity: i <= currentStep ? 1 : 0.4 }]}>{step}</Text>
          </View>
          {i < STEPS.length - 1 && (
            <View style={[
              styles.stepLine, 
              { backgroundColor: i < currentStep ? colors.saffron : colors.tabIconDefault + '40' }
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderAddressStep = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContent}>
      <Text variant="h3" family="heading" style={styles.stepTitle}>Select Delivery Address</Text>
      {SAVED_ADDRESSES.map((addr) => (
        <TouchableOpacity 
          key={addr.id} 
          onPress={() => setSelectedAddress(addr.id)}
          style={[
            styles.addressCard, 
            { 
              backgroundColor: colors.card || '#fff', 
              borderColor: selectedAddress === addr.id ? colors.saffron : 'transparent',
              borderWidth: 2
            }
          ]}
        >
          <View style={styles.addressHeader}>
            <View style={[styles.typeBadge, { backgroundColor: colors.saffron + '20' }]}>
               <Text variant="overline" style={{ color: colors.saffron }}>{addr.type}</Text>
            </View>
            {selectedAddress === addr.id && <Ionicons name="checkmark-circle" size={20} color={colors.saffron} />}
          </View>
          <Text variant="body1" family="heading" style={{ marginTop: 8 }}>{addr.name}</Text>
          <Text variant="body2" style={{ opacity: 0.6, marginTop: 4 }}>{addr.address}</Text>
          <Text variant="body2" style={{ opacity: 0.6, marginTop: 4 }}>{addr.phone}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={[styles.addBtn, { borderColor: colors.saffron }]}>
        <Ionicons name="add" size={20} color={colors.saffron} />
        <Text variant="body2" family="heading" style={{ color: colors.saffron, marginLeft: 8 }}>ADD NEW ADDRESS</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderDeliveryStep = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContent}>
      <Text variant="h3" family="heading" style={styles.stepTitle}>Select Delivery Slot</Text>
      
      <Text variant="overline" style={styles.subTitle}>SELECT DATE</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
        {SLOTS.map((slot) => (
          <TouchableOpacity 
            key={slot.id} 
            onPress={() => setSelectedDate(slot.id)}
            style={[
              styles.dateCard, 
              { 
                backgroundColor: selectedDate === slot.id ? colors.saffron : colors.card || '#fff',
                borderColor: selectedDate === slot.id ? colors.saffron : 'transparent',
                borderWidth: 1
              }
            ]}
          >
            <Text variant="body2" family="heading" style={{ color: selectedDate === slot.id ? '#000' : colors.text }}>{slot.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text variant="overline" style={[styles.subTitle, { marginTop: 20 }]}>SELECT TIME</Text>
      <View style={styles.timeGrid}>
        {SLOTS.find(s => s.id === selectedDate)?.times.map((time) => (
          <TouchableOpacity 
            key={time} 
            onPress={() => setSelectedTime(time)}
            style={[
              styles.timeCard, 
              { 
                backgroundColor: selectedTime === time ? colors.saffron : colors.card || '#fff',
                borderColor: selectedTime === time ? colors.saffron : 'transparent',
                borderWidth: 1
              }
            ]}
          >
            <Text variant="body2" style={{ color: selectedTime === time ? '#000' : colors.text }}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderPaymentStep = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContent}>
      <Text variant="h3" family="heading" style={styles.stepTitle}>Payment Method</Text>
      
      <TouchableOpacity style={[styles.paymentMethod, { backgroundColor: colors.card || '#fff' }]}>
         <Ionicons name="logo-google" size={24} color="#DB4437" />
         <Text variant="body1" family="heading" style={{ flex: 1, marginLeft: 15 }}>Google Pay</Text>
         <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.paymentMethod, { backgroundColor: colors.card || '#fff' }]}>
         <Ionicons name="card-outline" size={24} color={colors.saffron} />
         <Text variant="body1" family="heading" style={{ flex: 1, marginLeft: 15 }}>Credit / Debit Card</Text>
         <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.paymentMethod, { backgroundColor: colors.card || '#fff' }]}>
         <Ionicons name="wallet-outline" size={24} color={colors.cardamom} />
         <Text variant="body1" family="heading" style={{ flex: 1, marginLeft: 15 }}>SpiceCart Wallet</Text>
         <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.paymentMethod, { backgroundColor: colors.card || '#fff' }]}>
         <Ionicons name="cash-outline" size={24} color={colors.paprika} />
         <Text variant="body1" family="heading" style={{ flex: 1, marginLeft: 15 }}>Cash on Delivery</Text>
         <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Checkout',
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentStep === 0 && renderAddressStep()}
        {currentStep === 1 && renderDeliveryStep()}
        {currentStep === 2 && renderPaymentStep()}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.tabIconDefault + '30' }]}>
        <View style={styles.priceRow}>
          <Text variant="body2">Total Amount</Text>
          <Text variant="h2" family="price">₹897</Text>
        </View>
        <Button 
          title={currentStep === STEPS.length - 1 ? "PAY NOW" : "CONTINUE"} 
          onPress={handleNext}
          style={styles.nextBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBtn: { padding: 10 },
  stepIndicatorContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 20,
    paddingHorizontal: 40
  },
  stepItem: { alignItems: 'center' },
  stepCircle: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  stepLabel: { fontSize: 8, marginTop: 4 },
  stepLine: { flex: 1, height: 2, marginHorizontal: 10, marginTop: -15 },
  scrollContent: { padding: 20 },
  stepContent: { flex: 1 },
  stepTitle: { marginBottom: 20 },
  subTitle: { opacity: 0.5, marginBottom: 12 },
  addressCard: { 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  addBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderStyle: 'dashed',
    marginTop: 10
  },
  dateList: { marginBottom: 10 },
  dateCard: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginRight: 12 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeCard: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, width: (width - 60) / 2 },
  paymentMethod: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  footer: { 
    padding: 20, 
    paddingBottom: 40, 
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceRow: { flex: 1 },
  nextBtn: { width: width * 0.45, height: 50 }
});
