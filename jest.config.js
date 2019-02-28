module.exports = {
  browser: false,
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.{js,jsx}'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/example',
    'babel*',
    'jest*',
    'jsdom*'
  ],
  coverageReporters: ['json', 'text'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  globals: {
    NODE_ENV: 'test'
  },
  moduleDirectories: ['node_modules', '.', 'lib'],
  moduleFileExtensions: ['js', 'json', 'node', 'ts'],
  moduleNameMapper: {
    '\\.scss$': '<rootDir>/jest/__mocks__/styleMock.js'
  },
  rootDir: '.',
  roots: ['<rootDir>'],
  testPathIgnorePatterns: ['/node_modules/', '/example/'],
  testURL: 'http://localhost:4000',
  transform: {'^.+\\.js$': 'babel-jest'},
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lit-html|lit-element)/)'],
  testEnvironment: '<rootDir>/jsdom-custom-elements-environment',
  verbose: true,
  watchPathIgnorePatterns: ['node_modules', 'webpack']
};
