import React from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';

/**
 * A subtle texture overlay to give the UI an organic, premium feel.
 * This simulates a fine grain or paper texture.
 */
export const TextureOverlay = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View 
        style={[
          styles.texture, 
          { opacity: Platform.OS === 'ios' ? 0.03 : 0.05 }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  texture: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    // Using a very subtle pattern if possible, 
    // but for now a simple semi-transparent overlay with a specific blend mode
    // (Note: Blend modes are limited in RN, so we use low opacity)
  },
});
