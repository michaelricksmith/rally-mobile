import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState } from 'react';

export default function HomeFeed() {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <ScrollView
      style={styles.root}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(false)}
          tintColor="#22C55E"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to Rally</Text>
        <Text style={styles.subtitle}>Your activity feed is empty until Phase 1.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This week</Text>
        <Text style={styles.cardBody}>0 verified sessions · 0 active minutes · 0 points</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Open challenges</Text>
        <Text style={styles.cardBody}>
          No challenges yet. Join or create a group in the Groups tab.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connected devices</Text>
        <Text style={styles.cardBody}>
          No providers connected. Real connections land in Phase 4 / 9.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 24, paddingTop: 64, gap: 6 },
  greeting: { color: '#F8FAFC', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#94A3B8', fontSize: 14 },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  cardTitle: { color: '#F8FAFC', fontWeight: '700', marginBottom: 6 },
  cardBody: { color: '#CBD5E1' },
});
