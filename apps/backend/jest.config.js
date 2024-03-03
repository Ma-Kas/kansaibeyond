/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/test-setup/suite-setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/test-setup/*'],
};
