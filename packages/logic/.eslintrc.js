module.exports = {
  extends: [
    'prettier',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react/recommended',
  ],
  plugins: ['prettier', 'jsx-a11y', 'jest', '@babel'],
  env: {
    browser: true,
    'jest/globals': true,
  },
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  parser: '@babel/eslint-parser',
  rules: {
    'prettier/prettier': ['error'],
  },
};
