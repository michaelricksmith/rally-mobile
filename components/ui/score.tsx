/**
 * Scoreboard number. Big, monospaced, immediately readable.
 * Used for points, ranks, distances, minutes, sessions, streaks.
 */
import { Text, StyleSheet, type TextStyle, type StyleProp } from 'react-native';
import { palette, type } from '@/constants/theme';

interface Props {
  value: string | number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: StyleProp<TextStyle>;
}

export function Score({ value, size = 'lg', color, align = 'left', style }: Props) {
  return (
    <Text
      style={[sizeStyle[size], { color: color ?? palette.text, textAlign: align }, style]}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {value}
    </Text>
  );
}

const sizeStyle = StyleSheet.create({
  sm: { ...type.score4 },
  md: { ...type.score3 },
  lg: { ...type.score2 },
  xl: { ...type.score1 },
});
