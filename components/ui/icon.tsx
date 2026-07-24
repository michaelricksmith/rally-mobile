/**
 * Icon. A thin, controlled set of glyphs inlined as SVG path components.
 * No external icon library. Stroke 1.5 px at 24 px size per the brief.
 */
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { palette } from '@/constants/theme';
import SvgGlyph from './_svg-glyph';
import type { IconName } from './_icon-paths';

export type { IconName } from './_icon-paths';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Icon({ name, size = 24, color = palette.text, style }: Props) {
  return (
    <View
      style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <SvgGlyph name={name} size={size} color={color} />
    </View>
  );
}
