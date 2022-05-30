const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['import'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': [
      'warn',
      { allow: ['info', 'warn', 'error', 'time', 'timeEnd'] },
    ],
    'no-explicit-any': 'off',

    'node/no-unpublished-import': 'off',
    'node/no-unpublished-require': 'off',

    '@typescript-eslint/no-var-requires': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
});
