import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  runOnJS 
} from 'react-native-reanimated';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';

const { height } = Dimensions.get('window');

interface SpiceBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
}

export function SpiceBottomSheet({ isOpen, onClose, children, snapPoints = [height * 0.5] }: SpiceBottomSheetProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(height - snapPoints[0], { damping: 15, stiffness: 200 });
    } else {
      translateY.value = withSpring(height, { damping: 15, stiffness: 200 }, (finished) => {
        if (finished) {
          runOnJS(onClose)();
        }
      });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isOpen && translateY.value === height) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents={isOpen ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFillObject, backdropStyle]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFillObject}>
            <BlurView intensity={20} style={StyleSheet.absoluteFillObject} tint={colorScheme === 'dark' ? 'dark' : 'light'} />
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View 
        style={[
          styles.sheet, 
          animatedStyle, 
          { backgroundColor: colors.background, height: snapPoints[0] }
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: colors.tabIconDefault }]} />
        </View>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingHorizontal: 20,
    zIndex: 100,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
});