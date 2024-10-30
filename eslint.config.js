import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    // https://eslint.org/docs/latest/use/configure/ignore#ignoring-files
    // "**/node_modules/", and ".git/" are ignored by default
    // Keep ignores as first entry
    // https://www.raulmelo.me/en/blog/migration-eslint-to-flat-config#no-more-eslintignore
    ignores: [
      '**/build/',
      'dist',
      'prettier.config.mjs',
      'prettier.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'vite.config.js',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {jsx: true},
        sourceType: 'module',
      },
    },
    settings: {react: {version: '18.3'}},
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: true},
      ],

      'no-unused-vars': 'off',
      'no-unused-expressions': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-empty': 'off',
    },
  },
]
