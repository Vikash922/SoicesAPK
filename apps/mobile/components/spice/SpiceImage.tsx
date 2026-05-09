import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Image, ImageProps } from 'expo-image';

interface SpiceImageProps extends ImageProps {
  blurHash?: string;
  containerStyle?: ViewStyle;
}

// Default BlurHash for spices (warm, earthy tones)
const DEFAULT_BLURHASH = 'LNPH~K%M00WB~qRjM{WB00WBfQof';

export function SpiceImage({ 
  source, 
  blurHash = DEFAULT_BLURHASH, 
  style, 
  containerStyle,
  ...props 
}: SpiceImageProps) {
  return (
    <Image
      source={source}
      placeholder={{ blurhash: blurHash }}
      contentFit="cover"
      transition={200}
      style={[styles.image, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
