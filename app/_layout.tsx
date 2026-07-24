import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

function WebPreviewBanner() {
  if (Platform.OS !== 'web') return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>Web preview · iOS / Android native features disabled</Text>
    </View>
  );
}

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
      <WebPreviewBanner />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FACC15',
    paddingVertical: 4,
    alignItems: 'center',
    zIndex: 1000,
  },
  bannerText: { color: '#1F2937', fontSize: 11, fontWeight: '600' },
});
