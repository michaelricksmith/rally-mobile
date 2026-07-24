import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { listProviders } from '@/services/wearables/registry';

const NATIVE_ONLY_PROVIDERS = new Set([
  'apple_health',
  'apple_watch',
  'health_connect',
  'samsung_health',
]);

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
        renderItem={({ item }) => {
          const isNativeOnly = NATIVE_ONLY_PROVIDERS.has(item.id);
          const disabledOnWeb = Platform.OS === 'web' && isNativeOnly;
          return (
            <View style={[styles.row, disabledOnWeb && styles.rowDisabled]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.displayName}</Text>
                <Text style={styles.meta}>
                  {item.requiresOAuth ? 'OAuth sign-in' : 'Device permission'} · Phase 4 / 9
                </Text>
              </View>
              <Text style={styles.tag}>{disabledOnWeb ? 'Native only' : 'Coming soon'}</Text>
            </View>
          );
        }}
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
  rowDisabled: { opacity: 0.55 },
});
