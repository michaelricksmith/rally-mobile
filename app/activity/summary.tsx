import { View, Text, StyleSheet } from 'react-native';

export default function Summary() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Session summary</Text>
      <View style={styles.row}>
        <Text style={styles.k}>Active minutes</Text>
        <Text style={styles.v}>—</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.k}>Distance</Text>
        <Text style={styles.v}>—</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.k}>Active energy</Text>
        <Text style={styles.v}>—</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.k}>Avg heart rate</Text>
        <Text style={styles.v}>—</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.k}>Verification</Text>
        <Text style={styles.v}>—</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.k}>Points (preview)</Text>
        <Text style={styles.v}>—</Text>
      </View>
      <Text style={styles.note}>Real summaries are server-computed and land in Phase 5.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, gap: 8 },
  title: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  row: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  k: { color: '#CBD5E1' },
  v: { color: '#F8FAFC', fontWeight: '700' },
  note: { color: '#94A3B8', marginTop: 12 },
});
