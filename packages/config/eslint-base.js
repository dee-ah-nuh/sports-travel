// @ts-check
/** @type {import('eslint').Linter.Config[]} */
const base = [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/coverage/**'],
  },
  {
    rules: {
      // Safety
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      // Imports
      'import/no-duplicates': 'error',
      // TypeScript-covered rules — disable the JS versions
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
];

module.exports = base;
