/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  globalSetup: '<rootDir>/src/__tests__/test-setup/global-setup.ts',
  globalTeardown: '<rootDir>/src/__tests__/test-setup/global-teardown.ts',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/test-setup/suite-setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/test-setup/*'],
};
