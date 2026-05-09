/**
 * Themed components with SpiceCart Typography
 */
import { Text as DefaultText, View as DefaultView, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'] & {
  variant?: keyof typeof Typography.size;
  family?: keyof typeof Typography.fontFamily;
};

export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // @ts-ignore
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, variant = 'body1', family, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let defaultFamily: keyof typeof Typography.fontFamily = 'body';
  if (variant === 'display1' || variant === 'display2') defaultFamily = 'display';
  else if (variant === 'h1' || variant === 'h2' || variant === 'h3') defaultFamily = 'heading';
  else if (variant === 'price') defaultFamily = 'price';
  else if (variant === 'overline') defaultFamily = 'badge';

  const typographyStyle: any = {
    fontSize: Typography.size[variant],
    lineHeight: Typography.lineHeight[variant],
    fontFamily: Typography.fontFamily[family || defaultFamily],
    color,
  };

  if (variant === 'overline') {
    typographyStyle.letterSpacing = 1.5;
    typographyStyle.textTransform = 'uppercase';
  }

  if (variant === 'price') {
    typographyStyle.fontWeight = '700';
  }

  return <DefaultText style={[typographyStyle, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
