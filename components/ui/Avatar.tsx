import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface AvatarProps {
  source?: { uri: string };
  initials?: string;
  size?: number;
}

export function Avatar({ source, initials, size = 40 }: AvatarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.cardamom + '33',
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {source ? (
        <Image source={source} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initials, { fontSize: size / 2.5, color: colors.cardamom }]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: 'bold',
  },
});