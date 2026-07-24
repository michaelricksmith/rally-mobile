// Pure-Node test stub for react-native. Only the bits our service layer
// touches (Platform.OS). Real React Native code paths are not exercised
// under jest in this project; UI tests will get a separate setup later.
export const Platform = {
  OS: 'ios' as 'ios' | 'android' | 'web' | 'windows' | 'macos',
  select: <T>(
    map: Partial<Record<'ios' | 'android' | 'web' | 'windows' | 'macos', T>>,
  ): T | undefined => map['ios'],
  Version: 17,
};
