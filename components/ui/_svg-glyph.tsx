/**
 * SvgGlyph — render the Icon paths as real SVG via react-native-svg.
 * react-native-svg is already a dependency of expo-router, so this adds
 * zero new packages.
 */
import Svg, { Path } from 'react-native-svg';
import { PATHS, STROKE_ICONS, type IconName } from './_icon-paths';

interface Props {
  name: IconName;
  size: number;
  color: string;
}

export default function SvgGlyph({ name, size, color }: Props) {
  const d = PATHS[name];
  const stroke = STROKE_ICONS.has(name);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={stroke ? 'none' : color}>
      {stroke ? (
        <Path d={d} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <Path d={d} fill={color} />
      )}
    </Svg>
  );
}
