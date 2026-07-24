import { View, Text, StyleSheet } from 'react-native';

export default function Challenges() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Challenges</Text>
      <Text style={styles.subtitle}>No challenges yet. Group challenges land in Phase 6.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This week's group leaderboard</Text>
        <Text style={styles.cardBody}>
          Ranks, verified active minutes, and streak data will appear here once your group has
          activity.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, paddingTop: 64 },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#94A3B8', marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  cardTitle: { color: '#F8FAFC', fontWeight: '700', marginBottom: 6 },
  cardBody: { color: '#CBD5E1' },
});
