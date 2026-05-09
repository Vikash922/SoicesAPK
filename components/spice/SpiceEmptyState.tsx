import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import { Button } from '../ui/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';

interface SpiceEmptyStateProps {
  type: 'cart' | 'search' | 'orders';
  message?: string;
  action?: () => void;
  actionLabel?: string;
  style?: any;
}

const LOTTIE_SOURCES = {
  cart: 'https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/gears/data.json', // Placeholder
  search: 'https://raw.githubusercontent.com/spemer/lottie-animations-json/master/magnifying_glass.json',
  orders: 'https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/2016/data.json', // Placeholder
};

const DEFAULT_MESSAGES = {
  cart: 'Your spice jar is empty!',
  search: 'No spices found for your query.',
  orders: 'You haven\'t placed any orders yet.',
};

const DEFAULT_ACTIONS = {
  cart: 'START SHOPPING',
  search: 'BROWSE ALL SPICES',
  orders: 'DISCOVER SPICES',
};

export function SpiceEmptyState({ 
  type, 
  message, 
  action, 
  actionLabel,
  style 
}: SpiceEmptyStateProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const displayMessage = message || DEFAULT_MESSAGES[type];
  const displayActionLabel = actionLabel || DEFAULT_ACTIONS[type];
  const lottieSource = LOTTIE_SOURCES[type];

  return (
    <MotiView 
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: 200 }}
      style={[styles.container, style]}
    >
      <View style={styles.lottieContainer}>
        <LottieView 
          source={{ uri: lottieSource }}
          autoPlay 
          loop 
          style={styles.lottie} 
        />
      </View>
      <Text variant="h2" family="heading" style={styles.title}>
        {type === 'cart' ? 'Oops!' : type === 'search' ? 'No Results' : 'No Orders'}
      </Text>
      <Text variant="body2" style={[styles.message, { color: colors.tabIconDefault }]}>
        {displayMessage}
      </Text>
      {action && (
        <Button 
          title={displayActionLabel} 
          onPress={action} 
          style={styles.actionBtn}
        />
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  lottieContainer: {
    width: 250,
    height: 250,
    marginBottom: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  actionBtn: {
    width: '100%',
    height: 56,
  },
});
