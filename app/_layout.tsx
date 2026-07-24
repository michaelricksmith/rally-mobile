import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="group/[id]" options={{ headerShown: true, title: 'Group' }} />
        <Stack.Screen
          name="activity/start"
          options={{ headerShown: true, title: 'Start activity' }}
        />
        <Stack.Screen
          name="activity/session"
          options={{ headerShown: true, title: 'Active session' }}
        />
        <Stack.Screen
          name="activity/summary"
          options={{ headerShown: true, title: 'Session summary' }}
        />
        <Stack.Screen name="challenges/[id]" options={{ headerShown: true, title: 'Challenge' }} />
        <Stack.Screen
          name="profile/connected-devices"
          options={{ headerShown: true, title: 'Connected devices' }}
        />
        <Stack.Screen name="profile/privacy" options={{ headerShown: true, title: 'Privacy' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
