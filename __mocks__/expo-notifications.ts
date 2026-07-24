// Pure-Node test stub for expo-notifications.
export const setNotificationChannelAsync = async () => undefined;
export const getPermissionsAsync = async () => ({ status: 'undetermined' as const });
export const requestPermissionsAsync = async () => ({ status: 'denied' as const });
export const getExpoPushTokenAsync = async () => ({ data: 'fake-token' });
export const AndroidImportance = { MAX: 5, DEFAULT: 3, LOW: 1 } as const;
