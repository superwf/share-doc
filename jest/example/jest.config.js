const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'node', 'ts', 'tsx', 'json'],
  setupFiles: ['react-app-polyfill/jsdom', '<rootDir>/jest/setup.js'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  setupFilesAfterEnv: ['<rootDir>/jest/afterSetup.js'],
  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
}
