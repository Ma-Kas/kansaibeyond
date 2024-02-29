/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@kansaibeyond/eslint-config-custom/express.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  overrides: [
    {
      files: ['/src/__tests__/*'],
      env: {
        jest: true,
      },
    },
  ],
};
