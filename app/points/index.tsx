import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Animated, { 
  FadeInUp, 
  FadeInDown,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat
} from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfile, useClaimDailyBonus } from '@/hooks/useProfile';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const TIERS = [
  { id: 'seed', label: 'Seed', min: 0, color: '#4A7C59' },
  { id: 'ground', label: 'Ground', min: 500, color: '#8B4513' },
  { id: 'premium', label: 'Premium Saffron', min: 2000, color: '#E2B714' }
];

const WAYS_TO_EARN = [
  { id: '1', title: 'Place an Order', points: '+10 pts per ₹100', icon: 'bag-check-outline', color: '#E8590C' },
  { id: '2', title: 'Leave a Review', points: '+50 pts', icon: 'star-outline', color: '#E2B714' },
  { id: '3', title: 'Add Photo/Video', points: '+100 pts', icon: 'camera-outline', color: '#2E8B57' },
  { id: '4', title: 'Share a Recipe', points: '+200 pts', icon: 'restaurant-outline', color: '#C41E3A' },
];

export default function SpicePointsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { isGuest } = useAuthStore();
  const { data: profile, isLoading } = useProfile();
  const { mutate: claimBonus, isPending: isClaiming } = useClaimDailyBonus();

  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const points = profile?.spice_points || 0;
  const currentTierLabel = profile?.membership_tier || 'Seed';

  const nextTier = TIERS.find(t => t.min > points) || TIERS[TIERS.length - 1];
  const progressToNext = nextTier.min === 0 ? 100 : Math.min((points / nextTier.min) * 100, 100);

  const starScale = useSharedValue(1);

  useEffect(() => {
    starScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const rStarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starScale.value }]
  }));

  const handleClaimDaily = () => {
    claimBonus(undefined, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowRewardAnimation(true);
        setTimeout(() => setShowRewardAnimation(false), 3000);
      }
    });
  };

  if (isGuest) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerTitle: 'Spice Points', headerTransparent: true }} />
        <Ionicons name="ribbon-outline" size={80} color={colors.tabIconDefault} style={{ opacity: 0.3, marginBottom: 20 }} />
        <Text variant="h2" family="heading">Join the Club</Text>
        <Text variant="body2" style={{ textAlign: 'center', opacity: 0.6, marginTop: 10, paddingHorizontal: 40, marginBottom: 30 }}>
          Login to earn Spice Points on every purchase, unlock exclusive tiers, and redeem amazing rewards.
        </Text>
        <Button title="LOGIN NOW" onPress={() => router.replace('/(auth)/login')} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerTitle: 'Spice Rewards',
          headerTransparent: true,
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: colorScheme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)' }]}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.saffron} style={{ marginTop: 50 }} />
        ) : (
          <Animated.View entering={FadeInDown.delay(100)}>
            <LinearGradient
              colors={[colorScheme === 'dark' ? '#2A1A05' : '#FFF8E7', colorScheme === 'dark' ? '#1A0F03' : '#FDF2E9']}
              style={[styles.pointsCard, { borderColor: colors.saffron + '40', borderWidth: 1 }]}
            >
              <View style={styles.pointsHeader}>
                <View>
                  <Text variant="overline" family="badge" style={{ color: colors.saffron, letterSpacing: 2 }}>TOTAL BALANCE</Text>
                  <Text variant="display1" family="price" style={{ color: colors.text, marginTop: 5 }}>{points}</Text>
                  <Text variant="body2" style={{ opacity: 0.6 }}>Spice Points</Text>
                </View>
                <Animated.View style={[styles.starContainer, rStarStyle]}>
                  <Ionicons name="star" size={60} color={colors.saffron} />
                </Animated.View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text variant="caption" family="heading" style={{ color: colors.text }}>
                    Tier: <Text style={{ color: colors.saffron }}>{currentTierLabel}</Text>
                  </Text>
                  {points < nextTier.min && (
                    <Text variant="caption" style={{ opacity: 0.6 }}>
                      {nextTier.min - points} pts to {nextTier.label}
                    </Text>
                  )}
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                  <View style={[styles.progressBarFill, { width: `${progressToNext}%`, backgroundColor: colors.saffron }]} />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.claimBtn, { backgroundColor: colors.saffron }]}
                onPress={handleClaimDaily}
                disabled={isClaiming}
              >
                {isClaiming ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <>
                    <Ionicons name="gift-outline" size={20} color="#000" />
                    <Text variant="body2" family="heading" style={{ color: '#000', marginLeft: 8 }}>Claim Daily Bonus (+10)</Text>
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Benefits Section */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <Text variant="overline" family="badge" style={styles.sectionTitle}>YOUR BENEFITS</Text>
          <View style={styles.benefitsGrid}>
            <Card glass intensity={20} style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: colors.cardamom + '20' }]}>
                <Ionicons name="cash-outline" size={24} color={colors.cardamom} />
              </View>
              <Text variant="body2" family="heading" style={styles.benefitTitle}>Pay with Points</Text>
              <Text variant="caption" style={styles.benefitDesc}>100 pts = ₹10 off</Text>
            </Card>
            <Card glass intensity={20} style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: colors.turmeric + '20' }]}>
                <Ionicons name="car-outline" size={24} color={colors.turmeric} />
              </View>
              <Text variant="body2" family="heading" style={styles.benefitTitle}>Free Delivery</Text>
              <Text variant="caption" style={styles.benefitDesc}>On orders above ₹499</Text>
            </Card>
          </View>
        </Animated.View>

        {/* How to Earn */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
             <Text variant="overline" family="badge" style={styles.sectionTitle}>HOW TO EARN</Text>
             <TouchableOpacity><Text variant="caption" style={{ color: colors.saffron }}>View All</Text></TouchableOpacity>
          </View>
          
          <View style={[styles.earnList, { backgroundColor: colors.card || '#fff' }]}>
            {WAYS_TO_EARN.map((item, index) => (
              <View key={item.id} style={[
                styles.earnRow,
                index === WAYS_TO_EARN.length - 1 && { borderBottomWidth: 0 }
              ]}>
                <View style={[styles.earnIconContainer, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.earnInfo}>
                  <Text variant="body1" family="heading">{item.title}</Text>
                  <Text variant="caption" style={{ color: colors.saffron, marginTop: 2, fontWeight: 'bold' }}>{item.points}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.tabIconDefault} />
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Lottie Reward Animation Overlay */}
      {showRewardAnimation && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.lottieOverlay}>
            <LottieView 
              source={require('@/assets/lottie/reward_star.json')} 
              autoPlay 
              loop={false} 
              style={styles.rewardLottie}
            />
            <Animated.Text 
              entering={FadeInDown.delay(500)}
              style={[styles.rewardText, { color: colors.saffron }]}
            >
              +10 Points!
            </Animated.Text>
          </View>
          <LottieView 
            source={require('@/assets/lottie/spice_confetti.json')} 
            autoPlay 
            loop={false} 
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: Platform.OS === 'ios' ? 0 : 40 },
  scrollContent: { padding: 20, paddingTop: Platform.OS === 'ios' ? 100 : 120 },
  pointsCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#E2B714',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  pointsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  starContainer: { position: 'relative', width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  progressSection: { marginTop: 25 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  claimBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 25, 
    paddingVertical: 14, 
    borderRadius: 16 
  },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { opacity: 0.5, letterSpacing: 1.5, marginBottom: 15 },
  benefitsGrid: { flexDirection: 'row', marginHorizontal: -8 },
  benefitCard: { flex: 1, marginHorizontal: 8, padding: 16, alignItems: 'center' },
  benefitIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  benefitTitle: { textAlign: 'center', marginBottom: 4 },
  benefitDesc: { textAlign: 'center', opacity: 0.6 },
  earnList: { borderRadius: 20, padding: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  earnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.05)' },
  earnIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  earnInfo: { flex: 1 },
  lottieOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100 },
  rewardLottie: { width: 250, height: 250 },
  rewardText: { fontSize: 32, fontWeight: 'bold', fontFamily: 'DM Sans', marginTop: -20, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
});
