module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react',
          esModuleInterop: true,
          moduleResolution: 'node',
          target: 'es2020',
          allowJs: true,
          baseUrl: '.',
          paths: {
            '@/*': ['./*'],
            '@components/*': ['./components/*'],
            '@services/*': ['./services/*'],
            '@lib/*': ['./lib/*'],
            '@hooks/*': ['./hooks/*'],
            '@constants/*': ['./constants/*'],
            '@types/*': ['./types/*'],
          },
        },
        diagnostics: { ignoreCodes: [151001] },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@constants/(.*)$': '<rootDir>/constants/$1',
    '^@types/(.*)$': '<rootDir>/types/$1',
    // Stub React Native-only modules so pure-Node tests can run.
    '^expo-secure-store$': '<rootDir>/__mocks__/expo-secure-store.ts',
    '^expo-notifications$': '<rootDir>/__mocks__/expo-notifications.ts',
    '^react-native$': '<rootDir>/__mocks__/react-native.ts',
  },
};
