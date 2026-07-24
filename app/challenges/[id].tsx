import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ChallengeDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Challenge {id}</Text>
      <Text style={styles.subtitle}>
        Challenge detail UI. Real challenge CRUD lands in Phase 6.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Goal</Text>
        <Text style={styles.cardBody}>—</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress</Text>
        <Text style={styles.cardBody}>0 of 0</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Required verification</Text>
        <Text style={styles.cardBody}>—</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, gap: 12 },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#94A3B8' },
  card: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: { color: '#F8FAFC', fontWeight: '700', marginBottom: 6 },
  cardBody: { color: '#CBD5E1' },
});
