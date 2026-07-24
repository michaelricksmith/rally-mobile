import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  tone?: 'neutral' | 'success' | 'warn' | 'danger';
}

export function Pill({ label, tone = 'neutral' }: Props) {
  return (
    <View style={[styles.pill, styles[tone]]}>
      <Text style={[styles.label, styles[`${tone}Label` as const]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  neutral: { backgroundColor: '#1E293B', borderColor: '#334155' },
  success: { backgroundColor: '#052E16', borderColor: '#22C55E' },
  warn: { backgroundColor: '#3F2A05', borderColor: '#FACC15' },
  danger: { backgroundColor: '#3F0A0A', borderColor: '#EF4444' },
  label: { fontSize: 12, fontWeight: '600' },
  neutralLabel: { color: '#CBD5E1' },
  successLabel: { color: '#86EFAC' },
  warnLabel: { color: '#FDE68A' },
  dangerLabel: { color: '#FCA5A5' },
});
