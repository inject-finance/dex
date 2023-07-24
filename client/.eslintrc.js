module.exports = {
  env: {
    node: true,
    browser: true,
    jest: true
  },
  globals: {
    React: true
  },
  extends: [
    'eslint:all',
    'next/core-web-vitals',
    'plugin:sonarjs/recommended',
    'plugin:react/all',
    'plugin:security/recommended',
    'prettier'
  ],
  plugins: ['sonarjs', '@typescript-eslint', 'prettier'],
  parser: '@typescript-eslint/parser',
  root: true,
  ignorePatterns: [
    '.eslintrc.js',
    'tailwind.config.js',
    'jest.config.js',
    'next.config.js',
    'postcss.config.js'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'capitalized-comments': 'off',
    'class-methods-use-this': 'off',
    'id-length': 'off',
    'init-declarations': 'off',
    'linebreak-style': 'off',
    'max-lines-per-function': 'off',
    'max-lines': 'off',
    'max-statements': 'off',
    'multiline-comment-style': 'off',
    'no-console': 'warn',
    'no-html-link-for-pages': 'off',
    'no-magic-numbers': 'off',
    'no-negated-condition': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'no-ternary': 'off',
    'no-undefined': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'warn',
    'no-warning-comments': 'warn',
    'one-var': 'off',
    'prettier/prettier': 'warn',
    'react/button-has-type': 'off',
    'react/forbid-component-props': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-max-depth': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-no-literals': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.tsx']
      }
    ],
    'react/no-array-index-key': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'require-atomic-updates': 'off',
    'security/detect-non-literal-regexp': 'off',
    'security/detect-object-injection': 'off',
    'sort-imports': 'off',
    'sort-keys': 'off'
  }
}
