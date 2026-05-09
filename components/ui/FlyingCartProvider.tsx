import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  runOnJS,
  interpolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface FlyingItem {
  id: string;
  image: string;
  start: { x: number; y: number };
}

interface FlyingCartContextType {
  trigger: (image: string, start: { x: number; y: number }) => void;
}

const FlyingCartContext = createContext<FlyingCartContextType | null>(null);

export const useFlyingCart = () => {
  const context = useContext(FlyingCartContext);
  if (!context) throw new Error('useFlyingCart must be used within FlyingCartProvider');
  return context;
};

export const FlyingCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<FlyingItem[]>([]);

  const trigger = useCallback((image: string, start: { x: number; y: number }) => {
    const id = Math.random().toString(36).substring(7);
    setItems(prev => [...prev, { id, image, start }]);
  }, []);

  const onFinish = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <FlyingCartContext.Provider value={{ trigger }}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {items.map(item => (
          <FlyingItemComponent key={item.id} item={item} onFinish={() => onFinish(item.id)} />
        ))}
      </View>
    </FlyingCartContext.Provider>
  );
};

const FlyingItemComponent = ({ item, onFinish }: { item: FlyingItem; onFinish: () => void }) => {
  const progress = useSharedValue(0);
  
  // Cart is 3rd tab out of 5
  const targetX = (width / 5) * 2 + (width / 10);
  const targetY = height - 80;

  useEffect(() => {
    progress.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }, () => {
      runOnJS(onFinish)();
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // Basic linear interpolation for now, can be changed to bezier if needed
    const x = interpolate(progress.value, [0, 1], [item.start.x, targetX]);
    const y = interpolate(progress.value, [0, 1], [item.start.y, targetY]);
    const scale = interpolate(progress.value, [0, 1], [1, 0.2]);
    const opacity = interpolate(progress.value, [0, 0.8, 1], [1, 1, 0]);
    const rotate = interpolate(progress.value, [0, 1], [0, 360]);

    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 60,
      height: 60,
      transform: [
        { translateX: x - 30 }, 
        { translateY: y - 30 }, 
        { scale }, 
        { rotate: `${rotate}deg` }
      ],
      opacity,
      zIndex: 9999,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.glow}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E2B714',
  },
  glow: {
    shadowColor: '#E2B714',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  }
});
