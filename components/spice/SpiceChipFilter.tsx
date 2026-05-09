import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface FilterOption {
  id: string;
  label: string;
}

interface SpiceChipFilterProps {
  options: FilterOption[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
}

export function SpiceChipFilter({ options, selectedIds, onSelect, multiSelect = false }: SpiceChipFilterProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);
        return (
          <Chip 
            key={option.id}
            label={option.label}
            isSelected={isSelected}
            onPress={() => onSelect(option.id)}
            colors={colors}
          />
        );
      })}
    </ScrollView>
  );
}

interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  colors: any;
}

function Chip({ label, isSelected, onPress, colors }: ChipProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isSelected ? 1.05 : 1) }],
    };
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View 
        style={[
          styles.chip,
          { 
            backgroundColor: isSelected ? colors.saffron : colors.card,
            borderColor: isSelected ? colors.saffron : colors.border
          },
          animatedStyle
        ]}
      >
        <Text 
          variant="body2" 
          style={{ 
            color: isSelected ? '#000' : colors.text,
            fontWeight: isSelected ? '600' : 'normal' 
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});