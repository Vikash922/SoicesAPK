import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring, 
  withSequence,
  runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface SpiceToastProps {
  isVisible: boolean;
  type?: 'success' | 'error' | 'info';
  message: string;
  onHide: () => void;
  duration?: number;
}

export function SpiceToast({ 
  isVisible, 
  type = 'info', 
  message, 
  onHide, 
  duration = 3000 
}: SpiceToastProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const translateY = useSharedValue(-100); // Start off-screen (top)
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(40, { damping: 15, stiffness: 200 }); // Slide down to visible area
      opacity.value = withTiming(1, { duration: 300 });

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible]);

  const hideToast = () => {
    translateY.value = withTiming(-100, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(onHide)();
      }
    });
    opacity.value = withTiming(0, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return { icon: 'checkmark-circle', color: colors.cardamom };
      case 'error':
        return { icon: 'alert-circle', color: colors.chili };
      case 'info':
      default:
        return { icon: 'information-circle', color: colors.saffron };
    }
  };

  const config = getToastConfig();

  return (
    <Animated.View 
      style={[styles.container, animatedStyle, { backgroundColor: colors.card || '#fff' }]}
      accessibilityLiveRegion={type === 'error' ? 'assertive' : 'polite'}
      accessibilityRole="alert"
    >
      <View style={[styles.iconContainer, { backgroundColor: config.color + '22' }]}>
        <Ionicons name={config.icon as any} size={20} color={config.color} />
      </View>
      <Text variant="body2" family="heading" style={styles.message}>
        {message}
      </Text>
      <TouchableOpacity 
        onPress={hideToast} 
        style={styles.closeBtn}
        accessibilityLabel="Close notification"
        accessibilityRole="button"
      >
        <Ionicons name="close" size={20} color={colors.tabIconDefault} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 999,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  message: {
    flex: 1,
    lineHeight: 20,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
});
