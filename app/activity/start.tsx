import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function StartActivity() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const r = useRouter();
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Start {category ?? 'an activity'}</Text>
      <Text style={styles.body}>
        Choose a group, choose a source, and tap start. Real session recording lands in Phase 3.
      </Text>
      <View style={styles.options}>
        <View style={styles.option}>
          <Text style={styles.optionLabel}>Group: Select…</Text>
        </View>
        <View style={styles.option}>
          <Text style={styles.optionLabel}>Source: Phone (default)</Text>
        </View>
        <View style={styles.option}>
          <Text style={styles.optionLabel}>Sharing: With group</Text>
        </View>
      </View>
      <Pressable
        style={styles.cta}
        onPress={() => r.push({ pathname: '/activity/session', params: { category } })}
      >
        <Text style={styles.ctaLabel}>Start placeholder session</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, gap: 16 },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  body: { color: '#CBD5E1' },
  options: { gap: 8 },
  option: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  optionLabel: { color: '#F8FAFC', fontWeight: '600' },
  cta: { backgroundColor: '#22C55E', padding: 16, borderRadius: 12, alignItems: 'center' },
  ctaLabel: { color: '#052E16', fontWeight: '700' },
});
