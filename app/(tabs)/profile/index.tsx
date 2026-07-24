import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { APP_NAME, FEATURE_FLAGS } from '@/constants';

export default function Profile() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.subtitle}>Phase 0 placeholder profile.</Text>

      <View style={styles.section}>
        <Link href="/profile/connected-devices" asChild>
          <Pressable style={styles.row}>
            <Text style={styles.rowLabel}>Connected devices and apps</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </Link>
        <Link href="/profile/privacy" asChild>
          <Pressable style={styles.row}>
            <Text style={styles.rowLabel}>Privacy settings</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </Link>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Live tracking</Text>
          <Text style={styles.status}>{FEATURE_FLAGS.LIVE_TRACKING ? 'Enabled' : 'Phase 8'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, paddingTop: 64 },
  title: { color: '#F8FAFC', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#94A3B8', marginTop: 4 },
  section: { marginTop: 24, gap: 8 },
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
  rowLabel: { color: '#F8FAFC', fontWeight: '600' },
  chevron: { color: '#94A3B8', fontSize: 20 },
  status: { color: '#94A3B8' },
});
