/**
 * SegmentedControl. Two- or three-option pill switcher. Used for sharing
 * level, time window, and other short enum selectors.
 */
import { Pressable, View, Text, StyleSheet } from 'react-native';
import {
  palette,
  radius,
  space,
  type,
  accent as resolveAccent,
  type GroupAccent,
} from '@/constants/theme';

interface Props<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  groupAccent?: GroupAccent;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  groupAccent,
}: Props<T>) {
  const a = resolveAccent(groupAccent);
  return (
    <View style={styles.track}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active && { backgroundColor: a + '22', borderColor: a }]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && { color: palette.text }]} numberOfLines={1}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: palette.inkRaised,
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: radius.lg,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  label: { ...type.caption, color: palette.textMuted, fontWeight: '600' },
});

void space;
