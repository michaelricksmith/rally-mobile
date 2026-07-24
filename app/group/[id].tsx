import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GroupDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Group {id}</Text>
      <Text style={styles.subtitle}>Group dashboard. Real CRUD + invites land in Phase 2.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Members</Text>
        <Text style={styles.cardBody}>0 members</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This week's leaderboard</Text>
        <Text style={styles.cardBody}>Empty until first activity</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Active challenges</Text>
        <Text style={styles.cardBody}>None</Text>
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
