import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboarding() {
  const r = useRouter();
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Set up your profile</Text>
      <Text style={styles.body}>
        Display name, avatar, units, region. Real onboarding arrives in Phase 1.
      </Text>
      <Pressable style={styles.btn} onPress={() => r.replace('/(tabs)')}>
        <Text style={styles.btnLabel}>Save and continue (placeholder)</Text>
      </Pressable>
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
