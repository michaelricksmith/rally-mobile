/**
 * Card primitive. Three usages correspond to three card patterns in the
 * design system:
 *  - variant="surface"  → flat fill (inkRaised), 1 px hairline. Default.
 *  - variant="ghost"    → no fill, 1 px hairline. For minimal scoreboard modules.
 *  - variant="activity" → no fill, no border, big avatar left. For activity feed rows.
 */
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { palette, radius, space } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  variant?: 'surface' | 'ghost' | 'activity';
  padding?: number;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'surface', padding = space.lg, style }: Props) {
  return (
    <View
      style={[
        styles.base,
        variant === 'surface' && styles.surface,
        variant === 'ghost' && styles.ghost,
        variant === 'activity' && styles.activity,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.lg },
  surface: {
    backgroundColor: palette.inkRaised,
    borderWidth: 1,
    borderColor: palette.hairline,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: palette.hairline,
  },
  activity: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});
