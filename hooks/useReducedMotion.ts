import { useReducedMotion as useRNReducedMotion } from 'react-native-reanimated';

/**
 * Custom hook to check for reduced motion preference.
 * Use this to conditionally disable complex animations.
 */
export function useReducedMotion() {
  try {
    return useRNReducedMotion();
  } catch (e) {
    return false;
  }
}
