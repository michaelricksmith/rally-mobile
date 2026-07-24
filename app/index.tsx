import { Text, View, Pressable } from 'react-native';
import { Link } from 'expo-router';
const styles = {
  root: { flex: 1, backgroundColor: '#0F172A', padding: 24, paddingTop: 64 },
  brand: { gap: 12 },
  title: { color: '#F8FAFC', fontSize: 40, fontWeight: '800' as const },
  tagline: { color: '#CBD5E1', fontSize: 16, lineHeight: 22 },
  actions: { gap: 12 },
  buttonBase: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
    borderWidth: 1,
  },
  buttonSecondary: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center' as const,
    borderWidth: 1,
  },
  buttonPrimaryLabel: { color: '#052E16', fontSize: 16, fontWeight: '700' as const },
  buttonLabel: { color: '#F8FAFC', fontSize: 16, fontWeight: '600' as const },
  phase: { color: '#64748B', fontSize: 12, textAlign: 'center' as const, marginTop: 8 },
};
export default function Welcome() {
  return (
    <View style={styles.root}>
      <View style={styles.brand}>
        <Text style={styles.title}>Rally</Text>
        <Text style={styles.tagline}>
          Pickup games, challenges, and bragging rights with the people you actually like.
        </Text>
      </View>
      <View style={styles.actions}>
        <Link href="/(auth)/signup" asChild>
          <Pressable style={styles.buttonPrimary}>
            <Text style={styles.buttonPrimaryLabel}>Get started</Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.buttonSecondary}>
            <Text style={styles.buttonLabel}>I already have an account</Text>
          </Pressable>
        </Link>
        <Text style={styles.phase}>Phase 0 placeholder · real auth lands in Phase 1</Text>
      </View>
    </View>
  );
}
