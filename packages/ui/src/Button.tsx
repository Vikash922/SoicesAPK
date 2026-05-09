import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Text } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export function Button({ 
  title, 
  variant = 'primary', 
  style, 
  accessibilityLabel,
  accessibilityRole = 'button',
  ...props 
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.saffron };
      case 'secondary':
        return { backgroundColor: colors.cardamom };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.saffron };
      case 'danger':
        return { backgroundColor: colors.chili };
      default:
        return { backgroundColor: colors.saffron };
    }
  };

  const getTextStyle = () => {
    if (variant === 'outline') return { color: colors.saffron };
    return { color: colorScheme === 'light' ? '#000' : '#fff' };
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getButtonStyle(), style]} 
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole={accessibilityRole}
      {...props}
    >
      <Text variant="body1" family="heading" style={[styles.text, getTextStyle()]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 44, // WCAG 2.1 AA requirement
  },
  text: {
    fontWeight: '600',
  },
});
