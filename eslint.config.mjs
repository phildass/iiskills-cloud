import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/.next/",
      "**/build/",
      "**/coverage/",
      "**/out/",
      "**/.turbo/",
      "**/dist/",
      "**/.pnp.cjs",
      "**/.pnp.loader.mjs",
    ],
  },
  js.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    plugins: {
      prettier,
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
        JSX: "readonly",
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        fetch: "readonly",
        Headers: "readonly",
        Request: "readonly",
        Response: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        alert: "readonly",
        confirm: "readonly",
        Buffer: "readonly",
        FormData: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        MutationObserver: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        Blob: "readonly",
        File: "readonly",
        FileReader: "readonly",
        XMLHttpRequest: "readonly",
        Image: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "no-unused-vars": "warn",
      // Allow variable-declared functions (e.g. const fn = () => {}) to be
      // used before their definition — common pattern in React components
      // where callbacks are defined after the JSX/effects that reference them.
      "no-use-before-define": ["error", { functions: false, classes: true, variables: false }],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "prettier/prettier": "error",
    },
  },
  // Jest globals for test files — add `jest` object; other globals
  // (describe, it, expect, etc.) are declared via /* global */ comments
  // within each individual test file.
  {
    files: [
      "tests/**/*.test.js",
      "**/*.test.js",
      "**/*.spec.js",
      "tests/setup.js",
      "tests/__mocks__/**/*.js",
    ],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    rules: {
      // Allow redeclaring jest globals that may also be declared via /* global */ comments
      "no-redeclare": "off",
    },
  },
];
