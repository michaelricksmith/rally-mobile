/**
 * Stat — a label + a numeric value, designed for performance modules
 * (active minutes, sessions, points, streaks, distance). The number uses
 * Scoreboard typography. The label uses overline.
 */
import { View, Text, StyleSheet } from 'react-native';
import { palette, type } from '@/constants/theme';
import { Score } from './score';

interface Props {
  label: string;
  value: string | number;
  size?: 'sm' | 'md' | 'lg';
  tint?: string;
}

export function Stat({ label, value, size = 'md', tint }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Score
        value={value}
        size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'}
        color={tint ?? palette.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { ...type.overline, color: palette.textDim },
});
