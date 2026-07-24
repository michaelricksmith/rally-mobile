/**
 * Weekly leaderboard (full screen). Performance module: big ranks,
 * big numbers, rank-movement arrows, monospaced typography.
 */
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { palette, space, type, accent as resolveAccent, type GroupAccent } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { Score } from '@/components/ui/score';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { useState } from 'react';

const GROUP_ACCENT: GroupAccent = 'lime';
const a = resolveAccent(GROUP_ACCENT);

const RANKINGS = [
  { rank: 1, name: 'Maya R.', points: 412, sessions: 9, minutes: 287, streak: 14, movement: 1 },
  { rank: 2, name: 'Devon T.', points: 368, sessions: 8, minutes: 244, streak: 7, movement: 2 },
  { rank: 3, name: 'Jess K.', points: 290, sessions: 7, minutes: 198, streak: 12, movement: -1 },
  { rank: 4, name: 'Aaron P.', points: 218, sessions: 5, minutes: 162, streak: 4, movement: 0 },
  { rank: 5, name: 'You', points: 184, sessions: 4, minutes: 138, streak: 6, movement: 3 },
  { rank: 6, name: 'Sam B.', points: 142, sessions: 3, minutes: 91, streak: 2, movement: -2 },
  { rank: 7, name: 'Riley F.', points: 88, sessions: 2, minutes: 64, streak: 1, movement: 1 },
];

type Window = 'week' | 'month' | 'all-time';

export default function GroupDetail() {
  const [window, setWindow] = useState<Window>('week');
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.overline}>Sunday Pickup</Text>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.sub}>
          Rankings reset Sunday at midnight. Verified active minutes, sessions, and streaks.
        </Text>
      </View>

      {/* Window switcher */}
      <SegmentedControl
        options={[
          { value: 'week' as const, label: 'This week' },
          { value: 'month' as const, label: 'Month' },
          { value: 'all-time' as const, label: 'All time' },
        ]}
        value={window}
        onChange={setWindow}
        groupAccent={GROUP_ACCENT}
      />

      {/* Top 3 podium */}
      <View style={styles.podium}>
        {RANKINGS.slice(0, 3).map((r, i) => (
          <View key={r.rank} style={[styles.podiumSlot, i === 1 && styles.podiumCenter]}>
            <Avatar name={r.name} size="lg" groupAccent={GROUP_ACCENT} />
            <Text style={styles.podiumName} numberOfLines={1}>
              {r.name}
            </Text>
            <View style={styles.podiumPoints}>
              <Score value={r.points} size="lg" color={i === 0 ? a : palette.text} />
              <Text style={styles.podiumLabel}>points</Text>
            </View>
            <Pill
              label={`#${r.rank}`}
              variant={i === 0 ? 'default' : 'default'}
              groupAccent={GROUP_ACCENT}
            />
          </View>
        ))}
      </View>

      {/* Full ranking */}
      <Card variant="ghost" padding={0}>
        {RANKINGS.map((r, i) => (
          <View
            key={r.rank}
            style={[
              styles.row,
              i < RANKINGS.length - 1 && styles.rowDivider,
              r.name === 'You' && { backgroundColor: a + '0A' },
            ]}
          >
            <View style={styles.rowRank}>
              <Text style={[styles.rowRankText, r.rank === 1 && { color: a }]}>{r.rank}</Text>
            </View>
            <Avatar name={r.name} size="md" groupAccent={GROUP_ACCENT} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.rowName}>{r.name}</Text>
              <View style={styles.rowMeta}>
                <View style={styles.metaItem}>
                  <Icon name="play" size={11} color={palette.textMuted} />
                  <Text style={styles.metaText}>{r.sessions}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="flame" size={11} color={palette.textMuted} />
                  <Text style={styles.metaText}>{r.streak}d</Text>
                </View>
              </View>
            </View>
            <View style={styles.rowPoints}>
              <Score value={r.points} size="md" color={r.name === 'You' ? a : palette.text} />
              <Text style={styles.rowPointsLabel}>points</Text>
            </View>
            <View style={styles.movement}>
              {r.movement > 0 ? (
                <>
                  <View style={{ transform: [{ rotate: '180deg' }] }}>
                    <Icon name="chevron-down" size={14} color={palette.success} />
                  </View>
                  <Text style={[styles.movementText, { color: palette.success }]}>
                    {r.movement}
                  </Text>
                </>
              ) : r.movement < 0 ? (
                <>
                  <Icon name="chevron-down" size={14} color={palette.danger} />
                  <Text style={[styles.movementText, { color: palette.danger }]}>
                    {Math.abs(r.movement)}
                  </Text>
                </>
              ) : (
                <Text style={[styles.movementText, { color: palette.textDim }]}>—</Text>
              )}
            </View>
          </View>
        ))}
      </Card>

      {/* Footnote */}
      <View style={styles.footnote}>
        <Icon name="shield" size={12} color={palette.textDim} />
        <Text style={styles.footnoteText}>
          Points are server-calculated from verified active minutes. Phone, wearable, and HealthKit
          sources all count.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.inkDeep },
  content: { padding: space.xl, gap: space.lg, paddingTop: 24, paddingBottom: 120 },

  header: { gap: 6 },
  overline: { ...type.overline, color: palette.textDim },
  title: { ...type.display2, color: palette.text },
  sub: { ...type.body, color: palette.textMuted, maxWidth: 340 },

  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: space.md,
    paddingTop: space.md,
  },
  podiumSlot: { alignItems: 'center', gap: 6, flex: 1 },
  podiumCenter: { transform: [{ translateY: -10 }] },
  podiumName: { ...type.caption, color: palette.text, fontWeight: '700', marginTop: 4 },
  podiumPoints: { alignItems: 'center' },
  podiumLabel: { ...type.caption, color: palette.textDim, marginTop: 2 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: palette.divider },
  rowRank: { width: 24, alignItems: 'center' },
  rowRankText: { ...type.score3, color: palette.textMuted, fontSize: 18 },
  rowName: { ...type.bodyStrong, color: palette.text },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { ...type.caption, color: palette.textMuted },
  rowPoints: { alignItems: 'flex-end' },
  rowPointsLabel: { ...type.caption, color: palette.textDim, marginTop: 2 },
  movement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minWidth: 28,
    justifyContent: 'flex-end',
  },
  movementText: { ...type.caption, fontWeight: '700' },

  footnote: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.xs },
  footnoteText: { ...type.caption, color: palette.textDim, flex: 1 },
});
