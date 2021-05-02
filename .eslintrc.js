module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["preact"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "no-underscore-dangl": 0,
    "no-underscore-dangle": 0,
    "react/react-in-jsx-scope": 0,
  },
};
