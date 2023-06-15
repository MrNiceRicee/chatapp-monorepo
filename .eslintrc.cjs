/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './apps/*/tsconfig.json',
      './packages/*/tsconfig.json',
      // "./docs/tsconfig.json",
    ],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
  ],
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      },
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-var': 'error',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-useless-concat': 'error',
    'no-template-curly-in-string': 'error',
    'object-shorthand': ['error', 'always'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],
    'prefer-template': 'error',
    'prefer-const': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    'import/no-unresolved': 'error',
    'import/order': [
      "error",
      {
        groups: [
          'external',
          'builtin',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
  },
  ignorePatterns: [
    '**/dist/**',
    '**/node_modules/**',
    '.eslintrc.cjs',
    '**/config.*',
  ],
};

module.exports = config;
