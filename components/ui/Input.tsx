import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {label && <Text variant="caption" style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: colors.card,
            borderColor: error ? colors.chili : colors.border,
            color: colors.text
          },
          style
        ]}
        placeholderTextColor={colors.tabIconDefault}
        {...props}
      />
      {error && <Text variant="caption" style={[styles.error, { color: colors.chili }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    opacity: 0.8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
  },
  error: {
    marginTop: 4,
  },
});