/**
 * Avatar primitive. Shows an initial(s) on a tinted background.
 *  - size: sm (24), md (32), lg (40), xl (64)
 *  - accent: tints the background for member/group color theming
 */
import { View, Text, StyleSheet } from 'react-native';
import {
  palette,
  radius,
  type,
  accent as resolveAccent,
  type GroupAccent,
} from '@/constants/theme';

interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  groupAccent?: GroupAccent;
}

export function Avatar({ name, size = 'md', groupAccent }: Props) {
  const a = resolveAccent(groupAccent);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <View
      style={[
        styles.base,
        {
          width: SIZES[size],
          height: SIZES[size],
          borderRadius: SIZES[size] / 2,
          backgroundColor: a + '22',
          borderColor: a + '55',
        },
      ]}
    >
      <Text style={[styles.label, { fontSize: SIZES[size] / 2.6 }]}>{initials || '?'}</Text>
    </View>
  );
}

const SIZES: Record<NonNullable<Props['size']>, number> = { sm: 24, md: 32, lg: 40, xl: 64 };

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: { ...type.bodyStrong, color: palette.text, fontWeight: '700' },
});

// Force `radius` and `type` to be referenced so future noUnusedLocals doesn't
// drop them from the import list when this file is refactored.
void radius;
void type;
