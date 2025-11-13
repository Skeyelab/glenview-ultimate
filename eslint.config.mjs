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
    },
    rules: {
      ...love.rules,
      // Allow console statements (common in Next.js)
      'no-console': 'warn',
      // Relax complexity limits
      complexity: ['error', { max: 25 }],
      // Allow magic numbers (HTTP status codes, etc.)
      '@typescript-eslint/no-magic-numbers': ['error', {
        ignore: [-1, 0, 1, 2, 3, 4, 5, 10, 20, 100, 200, 400, 409, 500],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true,
        ignoreTypeIndexes: true
      }],
      // Relax strict boolean expressions
      '@typescript-eslint/strict-boolean-expressions': 'off',
      // Relax prefer nullish coalescing (|| is often fine)
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      // Relax object destructuring requirement
      '@typescript-eslint/prefer-destructuring': 'warn',
      // Allow missing return types for React components and simple functions
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true
      }],
      // Relax naming conventions for API fields (snake_case is common)
      '@typescript-eslint/naming-convention': ['error', {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case']
      }],
      // Allow unsafe operations in API routes (dealing with request bodies)
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow uninitialized variables
      '@typescript-eslint/init-declarations': 'off',
      // Relax unnecessary condition checks
      '@typescript-eslint/no-unnecessary-condition': 'warn'
    }
  },
  {
    files: ['app/api/**/*.ts'],
    rules: {
      // More lenient for API routes
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['lib/directus.ts'],
    rules: {
      // Allow unsafe operations in directus library (dealing with API responses from SDK)
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**'],
    rules: {
      // Relax rules for test files
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      complexity: 'off'
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
