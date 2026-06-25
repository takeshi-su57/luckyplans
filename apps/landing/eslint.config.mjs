import tsParser from '../../packages/config/node_modules/@typescript-eslint/parser/dist/index.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
];
