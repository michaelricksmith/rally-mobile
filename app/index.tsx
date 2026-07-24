import { Link } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { APP_NAME } from '@/constants';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.brand}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.tagline}>
          Pickup games, challenges, and bragging rights with the people you actually like.
        </Text>
      </View>
      <View style={styles.actions}>
        <Link href="/(auth)/signup" asChild>
          <Pressable style={[styles.button, styles.buttonPrimary]}>
            <Text style={styles.buttonPrimaryLabel}>Get started</Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonLabel}>I already have an account</Text>
          </Pressable>
        </Link>
        <Text style={styles.phase}>Phase 0 placeholder • real auth lands in Phase 1</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 24, justifyContent: 'space-between' },
  brand: { marginTop: 64, gap: 12 },
  title: { color: '#F8FAFC', fontSize: 40, fontWeight: '800' },
  tagline: { color: '#CBD5E1', fontSize: 16, lineHeight: 22 },
  actions: { gap: 12 },
  button: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  buttonPrimary: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
  buttonLabel: { color: '#F8FAFC', fontSize: 16, fontWeight: '600' },
  buttonPrimaryLabel: { color: '#052E16', fontSize: 16, fontWeight: '700' },
  phase: { color: '#64748B', fontSize: 12, textAlign: 'center', marginTop: 8 },
});
