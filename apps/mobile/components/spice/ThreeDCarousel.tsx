import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, ScrollView as RNScrollView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Text } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.85;
const SPACER = (width - ITEM_WIDTH) / 2;

export const ThreeDCarousel = ({ items }: { items: any[] }) => {
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<RNScrollView>(null);
  const currentIndex = useRef(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (items.length > 0) {
        currentIndex.current = (currentIndex.current + 1) % items.length;
        scrollViewRef.current?.scrollTo({
          x: currentIndex.current * ITEM_WIDTH,
          animated: true,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef as any}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SPACER }}
      >
        {items.map((item, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * ITEM_WIDTH,
              index * ITEM_WIDTH,
              (index + 1) * ITEM_WIDTH,
            ];

            const rotateY = interpolate(
              scrollX.value,
              inputRange,
              [45, 0, -45],
              Extrapolate.CLAMP
            );

            const scale = interpolate(
              scrollX.value,
              inputRange,
              [0.8, 1, 0.8],
              Extrapolate.CLAMP
            );

            return {
              transform: [
                { perspective: 1000 },
                { rotateY: `${rotateY}deg` },
                { scale }
              ],
            };
          });

          return (
            <View key={item.id} style={{ width: ITEM_WIDTH, paddingVertical: 20 }}>
              <Animated.View style={[styles.card, animatedStyle]}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.info}>
                  <Text variant="h2" family="display" style={{ color: '#E2B714' }}>{item.title}</Text>
                  <Text variant="body1" style={{ color: '#FFF' }}>{item.subtitle}</Text>
                </View>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 250 },
  card: { flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#16213E' },
  image: { ...StyleSheet.absoluteFillObject },
  info: { position: 'absolute', bottom: 20, left: 20 },
});
