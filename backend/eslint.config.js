const js = require("@eslint/js");
const globals = require("globals");
const sonarjs = require("eslint-plugin-sonarjs");

module.exports = [
  { ignores: ["node_modules"] },
  js.configs.recommended,
  sonarjs.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
      sourceType: "commonjs",
    },
  },
];
