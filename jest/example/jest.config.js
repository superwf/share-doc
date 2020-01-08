const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'node', 'ts', 'tsx', 'json'],
  setupFiles: ['<rootDir>/jest/setup.js'],
}
