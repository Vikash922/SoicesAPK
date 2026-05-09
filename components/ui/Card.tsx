import { StyleSheet, ViewProps, Platform } from 'react-native';
import { View } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { BlurView } from 'expo-blur';

interface CardProps extends ViewProps {
  glass?: boolean;
  intensity?: number;
}

export function Card({ style, glass = false, intensity = 20, children, ...props }: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  
  if (glass) {
    return (
      <View 
        style={[
          styles.card,
          styles.glassCard,
          isDark ? styles.glassCardDark : styles.glassCardLight,
          style
        ]}
        {...props}
      >
        <BlurView 
          intensity={intensity} 
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        {children}
      </View>
    );
  }

  return (
    <View 
      style={[
        styles.card, 
        isDark ? styles.cardDark : styles.cardLight,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 4,
  },
  cardLight: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardDark: {
    backgroundColor: '#16213E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  glassCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    elevation: 0, // Elevation breaks blur on Android
  },
  glassCardLight: {
    borderColor: 'rgba(255,255,255,0.4)',
  },
  glassCardDark: {
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
