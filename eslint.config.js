import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist/', '.astro/', 'node_modules/', 'public/', '.vercel/'],
  },
  ...eslintPluginAstro.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      // .astro formatting is enforced by `prettier --check` (astro plugin);
      // the inline prettier rule cannot handle astro script blocks.
      'prettier/prettier': 'off',
    },
  },
  {
    // virtual modules the astro processor extracts from <script> blocks
    files: ['**/*.astro/*.js', '**/*.astro/*.ts'],
    rules: {
      'prettier/prettier': 'off',
    },
  },
]
