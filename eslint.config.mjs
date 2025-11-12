import love from 'eslint-config-love'

export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ...love,
    languageOptions: {
      ...love.languageOptions,
      parserOptions: {
        ...love.languageOptions.parserOptions
      }
    }
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '*.min.js',
      '*.bundle.js',
      '.vercel/**',
      'jest.setup.js',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'eslint.config.mjs',
      'next-env.d.ts'
    ]
  }
]

