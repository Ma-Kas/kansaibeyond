/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@kansaibeyond/eslint-config-custom/react.js'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    project: true,
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
