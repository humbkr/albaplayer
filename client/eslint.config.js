import eslintPlugin from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import tsEslintPlugin from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import prettierPluginConfigRecommended from 'eslint-plugin-prettier/recommended'

export default tsEslintPlugin.config([
  eslintPlugin.configs.recommended,
  tsEslintPlugin.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  prettierPluginConfigRecommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript
    ],
    settings: {
      react: {
        version: 'detect',
      }
    }
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-imports': [
        2,
        { fixStyle: 'separate-type-imports' },
      ],
      // TODO: Enable this rule after move to vitest
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-restricted-imports': [
        2,
        {
          paths: [
            {
              // Prevents direct imports of react-redux hooks in favor of the pre-typed versions.
              name: 'react-redux',
              importNames: ['useSelector', 'useStore', 'useDispatch'],
              message: 'Please use pre-typed versions from `src/app/hooks.ts` instead.',
            },
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/semi': 'off',
      'arrow-parens': ['warn', 'always'],
      'capitalized-comments': [
        'warn',
        'always',
        {
          ignoreConsecutiveComments: true,
          ignorePattern: 'v8',
        },
      ],
      'comma-dangle': ['warn', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'ignore',
      }],
      'curly': ['warn', 'all'],
      'import/order': ['warn'],
      'import/no-anonymous-default-export': 'off',
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
      'import/no-named-as-default': 'off',
      // Does not work with typescript baseUrl config.
      'import/no-unresolved': 'off',
      'linebreak-style': [2, 'unix'],
      'max-len': ['warn', { code: 120 }],
      'no-case-declarations': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-empty-pattern': ['error'],
      'no-inline-comments': 'warn',
      'no-multi-assign': ['error'],
      'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1, 'maxBOF': 0 }],
      'no-nested-ternary': 'error',
      'no-param-reassign': 'off',
      'no-var': 'error',
      'object-curly-newline': ['warn'],
      'object-curly-spacing': ['warn', 'always'],
      // TODO: Enable this rule after move to vitest
      'react/display-name': 'off',
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'function-declaration', unnamedComponents: 'function-expression' },
      ],
      'react/prop-types': 'off',
      // Cannot configure the plugin with eslint 9
      // 'react-hooks/exhaustive-deps': 'error',
      'semi': ['warn', 'never'],
    },
  },
])
