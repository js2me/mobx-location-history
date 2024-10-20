/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('./package.json');

module.exports = {
  extends: [require.resolve('js2me-eslint-config')],
  rules: {
    "sonarjs/redundant-type-aliases": "off",
  },
};
