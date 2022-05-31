module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'arrow-parens': ['warn', 'always'],
    'arrow-body-style': ['warn'],
    'capitalized-comments': [
      'warn',
      'always',
      { ignoreConsecutiveComments: true },
    ],
    'comma-dangle': ['warn', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'ignore',
    }],
    'import/order': ['warn'],
    'import/no-anonymous-default-export': 'off',
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'linebreak-style': [2, 'unix'],
    'max-len': ['warn', { code: 120 }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-empty-pattern': ['error'],
    'no-inline-comments': 'warn',
    'no-multi-assign': ['error'],
    'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
    'no-nested-ternary': 'error',
    'no-var': 'error',
    'object-curly-newline': ['warn'],
    'object-curly-spacing': ['warn', 'always'],
    'react-hooks/exhaustive-deps': 'error',
    'semi': ['warn', 'never'],
  },
  settings: {
    react: {
      version: 'detect',
    }
  }
}
