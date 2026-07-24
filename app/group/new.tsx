import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function NewGroup() {
  const r = useRouter();
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Create a group</Text>
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Primary activity</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Max members (50)</Text>
      </View>
      <Pressable style={styles.cta} onPress={() => r.back()}>
        <Text style={styles.ctaLabel}>Create (placeholder)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, gap: 12 },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  field: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  label: { color: '#94A3B8' },
  cta: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaLabel: { color: '#052E16', fontWeight: '700' },
});
