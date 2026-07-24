import { View, Text, StyleSheet } from 'react-native';

export default function Privacy() {
  return (
    <View style={styles.root}>
      <Text style={styles.h1}>Privacy</Text>
      <Text style={styles.body}>
        Location, health, and wearable data are always voluntary. Rally never activates tracking on
        another user's behalf, and live sharing ends when your session ends.
      </Text>
      <Text style={styles.h2}>Default sharing levels</Text>
      <Text style={styles.body}>
        • Share with entire group (default for activities with friends)
      </Text>
      <Text style={styles.body}>• Share with selected friends</Text>
      <Text style={styles.body}>• Share activity status without location</Text>
      <Text style={styles.body}>• Share only the completed result</Text>
      <Text style={styles.body}>• Do not share activity information</Text>
      <Text style={styles.h2}>Storage and deletion</Text>
      <Text style={styles.body}>
        You can disconnect any provider and request deletion of imported data from Profile →
        Connected devices and apps. Detailed location history is only stored when you explicitly
        grant permission.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A', padding: 20, gap: 8 },
  h1: { color: '#F8FAFC', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  h2: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginTop: 16 },
  body: { color: '#CBD5E1', lineHeight: 20 },
});
