import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';

const PLACEHOLDER_GROUPS = [
  { id: 'demo-1', name: 'Sunday Pickup', members: 0, activity: 'pickleball' },
  { id: 'demo-2', name: 'Trail Crew', members: 0, activity: 'hiking' },
];

export default function Groups() {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Your groups</Text>
        <Link href="/group/new" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaLabel}>+ New group</Text>
          </Pressable>
        </Link>
      </View>
      <FlatList
        data={PLACEHOLDER_GROUPS}
        keyExtractor={(g) => g.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>You haven't joined any groups yet.</Text>}
        renderItem={({ item }) => (
          <Link href={`/group/${item.id}`} asChild>
            <Pressable style={styles.row}>
              <View>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <Text style={styles.rowMeta}>
                  {item.activity} · {item.members} members
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </Link>
        )}
      />
      <View style={styles.joinRow}>
        <Link href="/group/join" asChild>
          <Pressable style={styles.secondary}>
            <Text style={styles.secondaryLabel}>Join with code</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 12,
  },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800' },
  cta: { backgroundColor: '#22C55E', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  ctaLabel: { color: '#052E16', fontWeight: '700' },
  row: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: { color: '#F8FAFC', fontWeight: '700', fontSize: 16 },
  rowMeta: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  chevron: { color: '#94A3B8', fontSize: 24 },
  empty: { color: '#94A3B8', textAlign: 'center', marginTop: 48 },
  joinRow: { padding: 16 },
  secondary: {
    borderColor: '#334155',
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryLabel: { color: '#F8FAFC', fontWeight: '600' },
});
