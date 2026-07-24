import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function ActiveSession() {
  const r = useRouter();
  return (
    <View style={styles.root}>
      <Text style={styles.timer}>00:00:00</Text>
      <Text style={styles.body}>
        Live session UI. Real recording, motion sampling, and location smoothing land in Phase 3.
      </Text>
      <View style={styles.controls}>
        <Pressable style={styles.secondary}>
          <Text style={styles.secondaryLabel}>Pause</Text>
        </Pressable>
        <Pressable style={styles.secondary}>
          <Text style={styles.secondaryLabel}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.cta} onPress={() => r.replace('/activity/summary')}>
          <Text style={styles.ctaLabel}>Finish</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, gap: 16, justifyContent: 'center' },
  timer: { color: '#F8FAFC', fontSize: 56, fontWeight: '800', textAlign: 'center' },
  body: { color: '#CBD5E1', textAlign: 'center' },
  controls: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  secondary: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  secondaryLabel: { color: '#F8FAFC', fontWeight: '600' },
  cta: {
    backgroundColor: '#22C55E',
    padding: 14,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  ctaLabel: { color: '#052E16', fontWeight: '700' },
});
