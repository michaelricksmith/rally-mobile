/**
 * Home tab — Rally activity feed.
 *
 * Direction: activity-feed row pattern, social and conversational.
 * No chat-bubble cards. Greeting at the top, then a vertical list of
 * "this is what your groups are doing" cards, then a single
 * performance module for "this week".
 */
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { palette, space, type, accent as resolveAccent, type GroupAccent } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { Avatar } from '@/components/ui/avatar';

const GROUP_ACCENT: GroupAccent = 'lime';

const FEED = [
  {
    id: 'f1',
    group: 'Sunday Pickup',
    groupAccent: 'lime' as GroupAccent,
    actor: 'Maya R.',
    action: 'finished a 47 min pickleball session',
    when: '2 h ago',
    verified: true,
    points: 47,
  },
  {
    id: 'f2',
    group: 'Trail Crew',
    groupAccent: 'ember' as GroupAccent,
    actor: 'Devon T.',
    action: 'joined the August Hike challenge',
    when: '5 h ago',
    verified: false,
    points: 0,
  },
  {
    id: 'f3',
    group: 'Sunday Pickup',
    groupAccent: 'lime' as GroupAccent,
    actor: 'Jess K.',
    action: 'extended her streak to 12 days',
    when: 'yesterday',
    verified: true,
    points: 12,
  },
];

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(false)}
          tintColor={resolveAccent(GROUP_ACCENT)}
        />
      }
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greetingOverline}>Today</Text>
          <Text style={styles.greetingTitle}>Welcome back</Text>
        </View>
        <Avatar name="Michael S" size="lg" groupAccent={GROUP_ACCENT} />
      </View>

      {/* Performance module — this week */}
      <Card variant="ghost" padding={space.lg}>
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleLabel}>This week</Text>
          <Pill label="Verified minutes" groupAccent={GROUP_ACCENT} />
        </View>
        <View style={styles.moduleStats}>
          <View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>sessions</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>minutes</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>points</Text>
          </View>
        </View>
      </Card>

      {/* Activity feed */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <Link href="/(tabs)/groups" asChild>
            <Text style={styles.sectionActionAccent}>See groups</Text>
          </Link>
        </View>
        {FEED.map((item) => (
          <View key={item.id} style={styles.feedRow}>
            <Avatar name={item.actor} size="md" groupAccent={item.groupAccent} />
            <View style={{ flex: 1, gap: 4 }}>
              <View style={styles.feedMeta}>
                <Text style={styles.feedActor}>{item.actor}</Text>
                <Text style={styles.feedMetaDot}>·</Text>
                <Text style={styles.feedGroup} numberOfLines={1}>
                  {item.group}
                </Text>
              </View>
              <Text style={styles.feedAction}>{item.action}</Text>
              <View style={styles.feedFoot}>
                <Text style={styles.feedWhen}>{item.when}</Text>
                {item.verified ? (
                  <Pill label="Verified" variant="verified" />
                ) : (
                  <Pill label="Joined" />
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.inkDeep },
  content: { padding: space.xl, gap: space.xl, paddingTop: 64, paddingBottom: 120 },

  greeting: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  greetingOverline: { ...type.overline, color: palette.textDim },
  greetingTitle: { ...type.h1, color: palette.text, marginTop: 4 },

  moduleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moduleLabel: { ...type.overline, color: palette.textDim },
  moduleStats: { flexDirection: 'row', alignItems: 'center', marginTop: space.md },
  statValue: { ...type.score2, color: palette.text, fontSize: 36 },
  statLabel: { ...type.caption, color: palette.textMuted, marginTop: 2 },
  divider: { width: 1, height: 36, backgroundColor: palette.hairline, marginHorizontal: space.lg },

  section: { gap: space.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { ...type.h2, color: palette.text },
  sectionAction: { ...type.caption, fontWeight: '700' },
  sectionActionAccent: {
    ...type.caption,
    fontWeight: '700' as const,
    color: resolveAccent(GROUP_ACCENT),
  },

  feedRow: {
    flexDirection: 'row',
    gap: space.md,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
  },
  feedMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  feedActor: { ...type.bodyStrong, color: palette.text },
  feedMetaDot: { color: palette.textDim },
  feedGroup: { ...type.small, color: palette.textMuted },
  feedAction: { ...type.body, color: palette.text, lineHeight: 20 },
  feedFoot: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  feedWhen: { ...type.caption, color: palette.textDim },
});
