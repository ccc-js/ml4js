import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/**', 'dist-examples/**', 'coverage/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs['recommended-type-checked'].rules,
      ...tseslint.configs['stylistic-type-checked'].rules,
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-confusing-void-expression': 'off'
    }
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];
