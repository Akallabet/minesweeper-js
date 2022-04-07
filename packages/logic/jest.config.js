module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  // globalSetup: '<rootDir>/globalSetup.js',
};
