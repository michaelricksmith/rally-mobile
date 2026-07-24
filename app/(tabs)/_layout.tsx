import { Tabs } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  palette,
  radius,
  space,
  type,
  DEFAULT_GROUP_ACCENT,
  accent as resolveAccent,
} from '@/constants/theme';
import { Icon, type IconName } from '@/components/ui/icon';

interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
}

const TABS: TabConfig[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'groups/index', title: 'Groups', icon: 'users' },
  { name: 'challenges/index', title: 'Challenges', icon: 'trophy' },
  { name: 'profile/index', title: 'Profile', icon: 'user' },
];

function TabBarButton({
  tab,
  focused,
  onPress,
}: {
  tab: TabConfig;
  focused: boolean;
  onPress: () => void;
}) {
  const a = resolveAccent(DEFAULT_GROUP_ACCENT);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      style={styles.tab}
    >
      <Icon name={tab.icon} size={22} color={focused ? a : palette.textDim} />
      <Text style={[styles.tabLabel, { color: focused ? a : palette.textDim }]} numberOfLines={1}>
        {tab.title}
      </Text>
    </Pressable>
  );
}

function StartButton({ onPress }: { onPress: () => void }) {
  const a = resolveAccent(DEFAULT_GROUP_ACCENT);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Start activity"
      style={({ pressed }) => [
        styles.startButton,
        { backgroundColor: a, transform: [{ translateY: pressed ? 1 : 0 }] },
      ]}
    >
      <Icon name="play" size={26} color={palette.textInverse} />
    </Pressable>
  );
}

/**
 * Five-tab bar with a prominent center Start control. The Start control
 * is a 56 px solid group-accent circle that sits above the bar; tapping
 * it routes to /start. The four surrounding tabs are flat with the
 * active state tinted by the current group accent.
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View style={{ flex: 1, backgroundColor: palette.inkDeep }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
        tabBar={(props) => {
          const focusedName = props.state.routes[props.state.index]?.name;
          return (
            <View
              style={[
                styles.bar,
                {
                  paddingBottom: bottomPad,
                  backgroundColor: palette.inkDeep,
                  borderTopColor: palette.hairline,
                },
              ]}
            >
              <View style={styles.row}>
                {TABS.slice(0, 2).map((t) => (
                  <TabBarButton
                    key={t.name}
                    tab={t}
                    focused={focusedName === t.name}
                    onPress={() => props.navigation.navigate(t.name as never)}
                  />
                ))}
                <StartButton onPress={() => props.navigation.navigate('start/index' as never)} />
                {TABS.slice(2).map((t) => (
                  <TabBarButton
                    key={t.name}
                    tab={t}
                    focused={focusedName === t.name}
                    onPress={() => props.navigation.navigate(t.name as never)}
                  />
                ))}
              </View>
            </View>
          );
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="groups/index" />
        <Tabs.Screen name="start/index" />
        <Tabs.Screen name="challenges/index" />
        <Tabs.Screen name="profile/index" />
      </Tabs>
      {/* Bottom safe-area spacer, only on web. RN handles it via insets above. */}
      {Platform.OS === 'web' ? <View style={{ height: 0 }} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    gap: 4,
  },
  tabLabel: { ...type.caption, fontSize: 11, fontWeight: '600' },
  startButton: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 8,
  },
});
