import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Image, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Text } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

const { width } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
  onPress?: () => void;
}

interface SpiceCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

export function SpiceCarousel({ items, autoPlay = true, interval = 5000 }: SpiceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay && items.length > 1) {
      timer = setInterval(() => {
        const nextIndex = (activeIndex + 1) % items.length;
        scrollViewRef.current?.scrollTo({ x: nextIndex * (width - 40), animated: true });
        setActiveIndex(nextIndex);
      }, interval);
    }
    return () => clearInterval(timer);
  }, [activeIndex, autoPlay, items.length]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={width - 40}
        decelerationRate="fast"
      >
        {items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            activeOpacity={0.9} 
            onPress={item.onPress}
            style={[styles.card, { backgroundColor: item.backgroundColor }]}
          >
            <View style={styles.textContainer}>
              <Text variant="h1" family="display" style={styles.title}>{item.title}</Text>
              <Text variant="h3" family="heading" style={styles.subtitle}>{item.subtitle}</Text>
              <View style={styles.cta}>
                <Text variant="overline" family="badge" style={styles.ctaText}>SHOP NOW</Text>
              </View>
            </View>
            <Image source={{ uri: item.image }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {items.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.dot, 
              { backgroundColor: i === activeIndex ? colors.saffron : 'rgba(255,255,255,0.3)' },
              i === activeIndex && styles.activeDot
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 160,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  card: {
    width: width - 40,
    height: 160,
    borderRadius: 24,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    color: '#000',
    fontSize: 28,
  },
  subtitle: {
    color: '#000',
    opacity: 0.8,
  },
  cta: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: 10,
  },
  image: {
    width: 140,
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    left: 20,
    backgroundColor: 'transparent',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  activeDot: {
    width: 16,
  },
});
