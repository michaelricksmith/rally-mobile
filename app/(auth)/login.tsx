import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function Login() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.body}>Real login arrives in Phase 1.</Text>
      <Link href="/(tabs)" asChild>
        <Pressable style={styles.btn}>
          <Text style={styles.btnLabel}>Continue to app (placeholder)</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 24, backgroundColor: '#0F172A' },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '700' },
  body: { color: '#CBD5E1', marginTop: 12, marginBottom: 24 },
  btn: { backgroundColor: '#1E293B', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnLabel: { color: '#F8FAFC', fontWeight: '600' },
});
