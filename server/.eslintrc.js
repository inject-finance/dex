module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['sonarjs', '@typescript-eslint', 'prettier'],
  extends: [
    'eslint:all',
    'plugin:sonarjs/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/parameter-properties': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/init-declarations': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'linebreak-style': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        useTabs: false,
        semi: false,
        tabWidth: 2,
        trailingComma: 'none',
        endOfLine: 'auto'
      }
    ],
    'no-ternary': 'off',
    'sort-keys': 'off',
    'new-cap': 'off',
    'id-length': 'off',
    'no-undefined': 'off',
    'sort-vars': 'off',
    'sort-imports': 'off',
    'one-var': 'off',
    'padded-blocks': 'off',
    'multiline-comment-style': 'off',
    'capitalized-comments': 'off',
    'class-methods-use-this': 'off'
  }
}
