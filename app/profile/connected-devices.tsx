import { View, Text, StyleSheet, FlatList } from 'react-native';
import { listProviders } from '@/services/wearables/registry';

export default function ConnectedDevices() {
  const providers = listProviders();
  return (
    <View style={styles.root}>
      <Text style={styles.note}>
        Wearable connections are optional. Real provider integration lands in Phase 4 (Apple Health,
        Health Connect) and Phase 9 (Garmin, Fitbit, Oura, WHOOP).
      </Text>
      <FlatList
        data={providers}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.title}>{item.displayName}</Text>
              <Text style={styles.meta}>
                {item.requiresOAuth ? 'OAuth sign-in' : 'Device permission'} · Phase 4 / 9
              </Text>
            </View>
            <Text style={styles.tag}>Coming soon</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },
  note: { color: '#CBD5E1', padding: 16, lineHeight: 20 },
  row: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#F8FAFC', fontWeight: '700' },
  meta: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  tag: { color: '#FACC15', fontWeight: '600' },
});
