import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useUIStore } from '@/store/useUIStore';

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  const theme = useUIStore((state) => state.theme);

  if (theme === 'system') {
    return systemColorScheme;
  }
  
  return theme;
}
