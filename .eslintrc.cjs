/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('./package.json');

module.exports = {
  extends: [require.resolve('js2me-eslint-config')],
  rules: {
    "sonarjs/redundant-type-aliases": "off",
  },
  overrides: [
    {
      files: [
        "*.test.ts",
        "*.test.tsx"
      ],
      rules: {
        'sonarjs/no-identical-functions': 'off',
        'sonarjs/no-nested-functions': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/no-this-assignment': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'sonarjs/use-type-alias': 'off',
        'sonarjs/no-empty-test-file': 'off'
      },
      parserOptions: {
        project: 'tsconfig.test.json',
      },
    }
  ]
};
