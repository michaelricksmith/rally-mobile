import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

const ACTIVITIES: { id: string; label: string; emoji: string }[] = [
  { id: 'pickleball', label: 'Pickleball', emoji: '🥒' },
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'walking', label: 'Walking', emoji: '🚶' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'hiking', label: 'Hiking', emoji: '🥾' },
  { id: 'cycling', label: 'Cycling', emoji: '🚴' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'golf', label: 'Golf', emoji: '⛳' },
  { id: 'general_fitness', label: 'General fitness', emoji: '💪' },
];

export default function Start() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Start an activity</Text>
      <Text style={styles.subtitle}>
        Choose a category. Real session recording lands in Phase 3.
      </Text>
      <View style={styles.grid}>
        {ACTIVITIES.map((a) => (
          <Link
            key={a.id}
            href={{ pathname: '/activity/start', params: { category: a.id } }}
            asChild
          >
            <Pressable style={styles.tile}>
              <Text style={styles.emoji}>{a.emoji}</Text>
              <Text style={styles.tileLabel}>{a.label}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, paddingTop: 64 },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#94A3B8', marginTop: 4, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47%',
    aspectRatio: 1.1,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emoji: { fontSize: 36 },
  tileLabel: { color: '#F8FAFC', fontWeight: '600' },
});
