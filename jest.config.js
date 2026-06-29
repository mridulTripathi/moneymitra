/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleDirectories: ['node_modules'],
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  collectCoverageFrom: ['lib/calculators/**/*.ts'],
  // Statements/functions/lines held at 95%+. Branch set to 90% — the remaining
  // uncovered branches in emi.ts are defensive `?? fallback` guards that are
  // effectively unreachable with valid inputs.
  coverageThreshold: { global: { lines: 95, branches: 90, functions: 95, statements: 95 } },
};

module.exports = config;
