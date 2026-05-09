import React, { useRef, useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions, TouchableOpacity, Animated as RNAnimated } from 'react-native';
import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Button } from '@/components/ui/Button';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Discover Authentic Spices',
    subtitle: 'From farm to your kitchen, handpicked premium spices from global origins',
    lottie: require('@/assets/lottie/jar_pour.json'),
  },
  {
    id: '2',
    title: 'Every Spice, Every Blend',
    subtitle: '1000+ varieties from 50+ origin countries',
    lottie: require('@/assets/lottie/spice_mill.json'),
  },
  {
    id: '3',
    title: 'Cook with Confidence',
    subtitle: 'AI-powered recipe matching and spice pairings',
    lottie: require('@/assets/lottie/cooking_pot.json'),
  },
];

const SpiceAnimation = ({ source, style }: { source: any, style: any }) => {
  try {
    return <LottieView source={source} autoPlay loop style={style} />;
  } catch (e) {
    return (
      <View style={[style, { backgroundColor: '#f5f5f5', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="restaurant-outline" size={80} color="#ccc" />
      </View>
    );
  }
};

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new RNAnimated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const setOnboardingComplete = useUIStore((state) => state.setOnboardingComplete);

  const setGuest = useAuthStore((state) => state.setGuest);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleFinish = () => {
    setOnboardingComplete(true);
    router.replace('/(auth)/login');
  };

  const handleSkip = () => {
    setOnboardingComplete(true);
    setGuest(true);
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
    <View style={[styles.slide, { width }]}>
      <Animated.View entering={FadeInRight.duration(800)} style={styles.lottieContainer}>
        <SpiceAnimation source={item.lottie} style={styles.lottie} />
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.textContainer}>
        <Text variant="h2" family="heading" style={styles.title}>{item.title}</Text>
        <Text variant="body1" style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#1A1A2E' : colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text variant="body2" family="heading" style={{ color: colors.saffron }}>SKIP</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={RNAnimated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <RNAnimated.View
                key={i}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity, backgroundColor: colors.saffron },
                ]}
              />
            );
          })}
        </View>

        <Button
          title={currentIndex === ONBOARDING_DATA.length - 1 ? "GET STARTED" : "NEXT"}
          onPress={handleNext}
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 100, paddingTop: 50, alignItems: 'flex-end', paddingHorizontal: 20 },
  skipButton: { padding: 10 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  lottieContainer: { height: height * 0.4, width: '100%', alignItems: 'center', justifyContent: 'center' },
  lottie: { width: width * 0.8, height: width * 0.8 },
  textContainer: { alignItems: 'center', marginTop: 40 },
  title: { textAlign: 'center', marginBottom: 16 },
  subtitle: { textAlign: 'center', opacity: 0.7, lineHeight: 24 },
  footer: { height: 150, paddingHorizontal: 40, justifyContent: 'space-between', paddingBottom: 50 },
  pagination: { flexDirection: 'row', height: 10, justifyContent: 'center', alignItems: 'center' },
  dot: { height: 10, borderRadius: 5, marginHorizontal: 4 },
  ctaButton: { height: 56 },
});
