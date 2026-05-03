module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  extends: ["@open-wc/eslint-config"],
  env: { browser: true, es2020: true, node: true },
  rules: {
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "no-console": "off",
  },
  ignorePatterns: ["dist/", "node_modules/", "*.cjs", "*.mjs"],
};
