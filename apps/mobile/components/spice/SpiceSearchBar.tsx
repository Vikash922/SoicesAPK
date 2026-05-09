import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import { MotiView } from 'moti';

interface SpiceSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  voiceEnabled?: boolean;
  onVoiceSearch?: () => void;
}

export function SpiceSearchBar({
  placeholder = 'Search...',
  onSearch,
  voiceEnabled = false,
  onVoiceSearch,
}: SpiceSearchBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    Keyboard.dismiss();
  };

  return (
    <MotiView 
      animate={{
        borderColor: isFocused ? colors.saffron : 'transparent',
        borderWidth: isFocused ? 1 : 0,
        shadowOpacity: isFocused ? 0.1 : 0,
        shadowRadius: isFocused ? 8 : 0,
      }}
      transition={{ type: 'timing', duration: 300 }}
      style={[
        styles.container, 
        { backgroundColor: colorScheme === 'light' ? '#F5F5F5' : '#16213E' }
      ]}
    >
      <Ionicons name="search-outline" size={20} color={isFocused ? colors.saffron : colors.tabIconDefault} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.tabIconDefault}
        value={query}
        onChangeText={setQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {query.length > 0 ? (
        <TouchableOpacity onPress={handleClear} style={styles.iconBtn}>
          <Ionicons name="close-circle" size={18} color={colors.tabIconDefault} />
        </TouchableOpacity>
      ) : voiceEnabled ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onVoiceSearch} accessibilityLabel="Start voice search">
          <Ionicons name="mic-outline" size={20} color={colors.tabIconDefault} />
        </TouchableOpacity>
      ) : null}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 24,
    shadowColor: '#E2B714',
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  iconBtn: {
    padding: 4,
  },
});
