module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": "off",
    "prefer-const": "error",
    "no-var": "error",
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
  },
};
