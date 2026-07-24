import {
  Pressable,
  Text,
  View,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  palette,
  radius,
  space,
  type,
  accent as resolveAccent,
  type GroupAccent,
} from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  groupAccent?: GroupAccent;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  block?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SURFACE: Record<Variant, { backgroundColor: string; borderColor: string }> = {
  primary: { backgroundColor: palette.text, borderColor: palette.text },
  secondary: { backgroundColor: 'transparent', borderColor: palette.hairline },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  danger: { backgroundColor: palette.danger, borderColor: palette.danger },
};

const PRESSED: Record<Variant, { backgroundColor: string }> = {
  primary: { backgroundColor: palette.textMuted },
  secondary: { backgroundColor: palette.inkRaised },
  ghost: { backgroundColor: palette.inkRaised },
  danger: { backgroundColor: '#B91C1C' },
};

const LABEL_COLOR: Record<Variant, string> = {
  primary: palette.textInverse,
  secondary: palette.text,
  ghost: palette.textMuted,
  danger: '#FFFFFF',
};

const SIZE_PAD: Record<
  Size,
  { paddingVertical: number; paddingHorizontal: number; minHeight: number }
> = {
  sm: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 32 },
  md: { paddingVertical: 12, paddingHorizontal: 16, minHeight: 44 },
  lg: { paddingVertical: 16, paddingHorizontal: 20, minHeight: 52 },
};

const SIZE_LABEL = StyleSheet.create({
  sm: { fontSize: 13, lineHeight: 16, fontWeight: '600' as const },
  md: { ...type.bodyStrong },
  lg: { fontSize: 16, lineHeight: 20, fontWeight: '700' as const },
});

/**
 * Single source of truth for every CTA in the app.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  groupAccent,
  leadingIcon,
  trailingIcon,
  block,
  style,
  disabled,
  ...rest
}: Props) {
  const accentColor = resolveAccent(groupAccent);
  const surface =
    variant === 'primary' && groupAccent
      ? { backgroundColor: accentColor, borderColor: accentColor }
      : SURFACE[variant];
  const pressed =
    variant === 'primary' && groupAccent
      ? { backgroundColor: accentColor + 'CC' }
      : PRESSED[variant];
  const labelColor =
    variant === 'primary' && groupAccent ? palette.textInverse : LABEL_COLOR[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed: isPressed }) => [
        styles.base,
        SIZE_PAD[size],
        surface,
        block && { alignSelf: 'stretch' },
        isPressed && pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {leadingIcon ? <View style={styles.icon}>{leadingIcon}</View> : null}
      <Text style={[styles.label, SIZE_LABEL[size], { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
      {trailingIcon ? <View style={styles.icon}>{trailingIcon}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: space.sm,
  },
  icon: { alignItems: 'center', justifyContent: 'center' },
  label: {},
  disabled: { opacity: 0.4 },
});
