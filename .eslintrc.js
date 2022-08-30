module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint'), 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'react'],

  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
  },
};
