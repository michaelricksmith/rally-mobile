import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function JoinGroup() {
  const r = useRouter();
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Join a group</Text>
      <Text style={styles.subtitle}>Paste a code, scan a QR, or open an invite link.</Text>
      <View style={styles.field}>
        <Text style={styles.label}>Invite code</Text>
      </View>
      <Pressable style={styles.cta} onPress={() => r.back()}>
        <Text style={styles.ctaLabel}>Join (placeholder)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, gap: 12 },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#94A3B8' },
  field: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  label: { color: '#94A3B8' },
  cta: { backgroundColor: '#22C55E', padding: 16, borderRadius: 12, alignItems: 'center' },
  ctaLabel: { color: '#052E16', fontWeight: '700' },
});
