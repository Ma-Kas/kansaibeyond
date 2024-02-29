/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  globalSetup: '<rootDir>/src/__tests__/settings/global-setup.ts',
  globalTeardown: '<rootDir>/src/__tests__/settings/global-teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/settings/suite-setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/settings/*'],
};
