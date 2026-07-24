/**
 * Pill — small status chip. Variants: default, solid, live, verified,
 * warn, danger. Optionally tinted with a group accent (border + bg tint).
 */
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import {
  palette,
  radius,
  type,
  accent as resolveAccent,
  type GroupAccent,
} from '@/constants/theme';

type Variant = 'default' | 'solid' | 'live' | 'verified' | 'warn' | 'danger';

interface Props {
  label: string;
  variant?: Variant;
  groupAccent?: GroupAccent;
  style?: StyleProp<ViewStyle>;
}

const SURFACE: Record<Variant, { borderColor: string; backgroundColor: string }> = {
  default: { borderColor: palette.hairline, backgroundColor: 'transparent' },
  solid: { borderColor: 'transparent', backgroundColor: palette.text },
  live: { borderColor: palette.live + '55', backgroundColor: palette.live + '14' },
  verified: { borderColor: palette.success, backgroundColor: palette.success + '14' },
  warn: { borderColor: palette.warn, backgroundColor: palette.warn + '14' },
  danger: { borderColor: palette.danger, backgroundColor: palette.danger + '14' },
};

const LABEL_COLOR: Record<Variant, string> = {
  default: palette.textMuted,
  solid: palette.textInverse,
  live: palette.live,
  verified: palette.success,
  warn: palette.warn,
  danger: palette.danger,
};

export function Pill({ label, variant = 'default', groupAccent, style }: Props) {
  const accentColor = resolveAccent(groupAccent);
  // When a groupAccent is provided AND variant is default, use the accent as a
  // subtle tinted border. Other variants keep their semantic color.
  const surface =
    groupAccent && variant === 'default'
      ? { borderColor: accentColor, backgroundColor: accentColor + '14' }
      : SURFACE[variant];
  const labelColor = groupAccent && variant === 'default' ? accentColor : LABEL_COLOR[variant];
  return (
    <View style={[styles.base, surface, style]}>
      {variant === 'live' ? <View style={[styles.dot, { backgroundColor: palette.live }]} /> : null}
      <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: { ...type.caption, fontWeight: '600' },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
