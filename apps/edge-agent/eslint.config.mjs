import { dirname } from 'path';
import { fileURLToPath } from 'url';
import baseConfig from '@luckyplans/config/eslint-preset.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
