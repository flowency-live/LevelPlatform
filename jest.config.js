/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/lib', '<rootDir>/components', '<rootDir>/app'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'components/**/*.tsx',
    'app/**/*.tsx',
    '!**/*.test.ts',
    '!**/*.test.tsx',
    '!**/*.d.ts',
  ],
};

module.exports = config;
