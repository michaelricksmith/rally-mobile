import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={styles.icon}>
      <Text style={[styles.iconText, focused && styles.iconTextFocused]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: { backgroundColor: '#0F172A', borderTopColor: '#1E293B' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon label="H" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="groups/index"
        options={{
          title: 'Groups',
          tabBarIcon: ({ focused }) => <TabIcon label="G" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="start/index"
        options={{
          title: 'Start',
          tabBarIcon: ({ focused }) => <TabIcon label="S" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="challenges/index"
        options={{
          title: 'Challenges',
          tabBarIcon: ({ focused }) => <TabIcon label="C" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon label="P" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: { alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#94A3B8', fontSize: 12, fontWeight: '700' },
  iconTextFocused: { color: '#22C55E' },
});
