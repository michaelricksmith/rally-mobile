import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function Signup() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.body}>
        Real sign-up arrives in Phase 1. This placeholder proves the navigation and theme are wired.
      </Text>
      <Link href="/(auth)/onboarding" asChild>
        <Pressable style={styles.btn}>
          <Text style={styles.btnLabel}>Continue (placeholder)</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 24, backgroundColor: '#0F172A' },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '700' },
  body: { color: '#CBD5E1', marginTop: 12, marginBottom: 24 },
  btn: { backgroundColor: '#22C55E', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnLabel: { color: '#052E16', fontWeight: '700' },
});
