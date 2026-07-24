/**
 * Welcome — Rally landing.
 *
 * Direction: minimal, social-first. Wordmark + display headline + one
 * supporting sentence + primary Get Started CTA + three concise benefit
 * lines. No animated mesh. Background is a flat dark surface with a
 * single restrained abstract movement graphic in the hero (CSS-only,
 * no asset).
 */
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import {
  palette,
  radius,
  space,
  type,
  DEFAULT_GROUP_ACCENT,
  accent as resolveAccent,
} from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const BENEFITS = [
  { icon: 'users' as const, text: 'Built for private friend groups' },
  { icon: 'watch' as const, text: 'Works with your phone or wearable' },
  { icon: 'shield' as const, text: 'Verified activity, fair competition' },
];

export default function Welcome() {
  const a = resolveAccent(DEFAULT_GROUP_ACCENT);
  return (
    <View style={styles.root}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroAccent} pointerEvents="none" />
        <View style={styles.wordmarkWrap}>
          <Text style={styles.wordmark}>Rally</Text>
          <View style={[styles.dot, { backgroundColor: a }]} />
        </View>
        <Text style={styles.headline}>Pickup games that actually happen.</Text>
        <Text style={styles.subline}>Private groups. Real activity. Friendly competition.</Text>
      </View>

      {/* Benefits */}
      <View style={styles.benefits}>
        {BENEFITS.map((b) => (
          <View key={b.icon} style={styles.benefit}>
            <View style={styles.benefitIcon}>
              <Icon name={b.icon} size={20} color={a} />
            </View>
            <Text style={styles.benefitText}>{b.text}</Text>
          </View>
        ))}
      </View>

      {/* CTAs */}
      <View style={styles.actions}>
        <Link href="/(auth)/signup" asChild>
          <Button
            label="Get started"
            size="lg"
            block
            groupAccent={DEFAULT_GROUP_ACCENT}
            leadingIcon={<Icon name="arrow-right" size={18} color={palette.textInverse} />}
          />
        </Link>
        <Link href="/(auth)/login" asChild>
          <Button label="I already have an account" variant="ghost" size="md" block />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.inkDeep,
    paddingHorizontal: space.xxl,
    paddingTop: 72,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  hero: { gap: 18 },
  heroAccent: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 999 as unknown as number,
    backgroundColor: DEFAULT_GROUP_ACCENT ? resolveAccent(DEFAULT_GROUP_ACCENT) : '#D7FF3C',
    opacity: 0.08,
    transform: [{ rotate: '22deg' }],
  },
  wordmarkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: { ...type.display1, color: palette.text, fontSize: 36 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  headline: { ...type.display2, color: palette.text, maxWidth: 320 },
  subline: { ...type.body, color: palette.textMuted, maxWidth: 320 },

  benefits: { gap: space.md },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: { ...type.body, color: palette.text, fontWeight: '500' },

  actions: { gap: space.sm },
});
