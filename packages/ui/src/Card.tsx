import { StyleSheet, ViewProps } from 'react-native';
import { View } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

export function Card({ style, ...props }: ViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <View 
      style={[
        styles.card, 
        colorScheme === 'dark' ? styles.cardDark : styles.cardLight,
        style
      ]} 
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  cardLight: {
    backgroundColor: '#fff',
  },
  cardDark: {
    backgroundColor: '#16213E', // Card Dark from blueprint
  },
});
