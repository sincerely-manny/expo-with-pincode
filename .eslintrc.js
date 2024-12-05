module.exports = {
  root: true,
  plugins: [
    "prettier",
    "unused-imports",
    "simple-import-sort",
    "unicorn",
    "eslint-plugin-react-compiler",
  ],
  extends: [
    "expo",
    "prettier",
    "plugin:tailwindcss/recommended",
    "plugin:@tanstack/query/recommended",
  ],
  rules: {
    "react-compiler/react-compiler": "error",
    "quote-props": ["error", "as-needed"],
    "prefer-const": "error",
    "prettier/prettier": "error",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "react/display-name": "off",
    "react/function-component-definition": "warn",
    "react/self-closing-comp": "warn",
    "react/jsx-curly-brace-presence": [
      "error",
      {
        props: "never",
        children: "never",
      },
    ],
    "import/prefer-default-export": "off",
    "tailwindcss/classnames-order": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "tailwindcss/no-custom-classname": "error",
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
        ignore: ["/android", "/ios", "/modules"],
      },
    ],
  },
  ignorePatterns: ["build"],
};
