/**
 * Active session. Big timer in the center, scoreboard typography. Live
 * pill at the top. Action buttons in a footer row, not stacked. Sharing
 * level and source row at the top of the controls area.
 */
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  palette,
  radius,
  space,
  type,
  accent as resolveAccent,
  type GroupAccent,
} from '@/constants/theme';
import { Pill } from '@/components/ui/pill';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useEffect, useState } from 'react';

const GROUP_ACCENT: GroupAccent = 'lime';
const a = resolveAccent(GROUP_ACCENT);

function fmt(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ActiveSession() {
  const r = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <View style={styles.root}>
      {/* Top status */}
      <View style={styles.statusRow}>
        <Pill label="Live" variant="live" />
        <Pill label="Pickleball" groupAccent={GROUP_ACCENT} />
        <Pill label="Phone" />
      </View>

      {/* Timer */}
      <View style={styles.timerBlock}>
        <Text style={styles.overline}>Active session</Text>
        <Text style={styles.timer}>{fmt(seconds)}</Text>
        <Text style={styles.timerSub}>
          {paused ? 'Paused' : 'Recording motion + approximate location'}
        </Text>
      </View>

      {/* Live metrics — scoreboard style */}
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Active</Text>
          <Text style={styles.metricValue}>{Math.floor(seconds / 60)}</Text>
          <Text style={styles.metricUnit}>min</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Distance</Text>
          <Text style={styles.metricValue}>0.0</Text>
          <Text style={styles.metricUnit}>mi</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Pace</Text>
          <Text style={[styles.metricValue, { color: a }]}>—</Text>
          <Text style={styles.metricUnit}>mph</Text>
        </View>
      </View>

      {/* Footer controls */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable style={styles.secondary} onPress={() => setPaused((p) => !p)}>
            <Icon name={paused ? 'play' : 'x'} size={20} color={palette.text} />
            <Text style={styles.secondaryLabel}>{paused ? 'Resume' : 'Pause'}</Text>
          </Pressable>
          <Pressable style={[styles.secondary, styles.secondaryDanger]}>
            <Icon name="x" size={20} color={palette.danger} />
            <Text style={[styles.secondaryLabel, { color: palette.danger }]}>Cancel</Text>
          </Pressable>
          <Button
            label="Finish"
            size="lg"
            groupAccent={GROUP_ACCENT}
            onPress={() => r.replace('/activity/summary')}
            style={{ flex: 1.2 }}
            leadingIcon={<Icon name="check" size={18} color={palette.textInverse} />}
          />
        </View>
        <Text style={styles.footerNote}>
          Live location is shared with your group only while this session is active.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.inkDeep,
    paddingHorizontal: space.xxl,
    paddingTop: 24,
    paddingBottom: 32,
  },

  statusRow: { flexDirection: 'row', gap: 8, marginTop: 8 },

  timerBlock: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md },
  overline: { ...type.overline, color: palette.textDim },
  timer: { ...type.score1, color: palette.text, fontSize: 72, lineHeight: 80 },
  timerSub: { ...type.body, color: palette.textMuted },

  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.hairline,
    paddingVertical: space.lg,
  },
  metric: { flex: 1, alignItems: 'center', gap: 2 },
  metricLabel: { ...type.overline, color: palette.textDim },
  metricValue: { ...type.score2, color: palette.text, fontSize: 28 },
  metricUnit: { ...type.caption, color: palette.textMuted },
  metricDivider: { width: 1, height: 36, backgroundColor: palette.hairline },

  footer: { gap: space.md },
  footerRow: { flexDirection: 'row', gap: space.sm, alignItems: 'center' },
  secondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.hairline,
    backgroundColor: 'transparent',
  },
  secondaryDanger: { borderColor: palette.danger + '55' },
  secondaryLabel: { ...type.bodyStrong, color: palette.text, fontSize: 14 },
  footerNote: { ...type.caption, color: palette.textDim, textAlign: 'center' },
});
