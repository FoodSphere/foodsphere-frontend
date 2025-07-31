// eslint.config.mjs
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importSortPlugin from "eslint-plugin-simple-import-sort";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    ignores: [".next/", "node_modules/", "dist/", "build/"],
  },

  // การตั้งค่าพื้นฐานสำหรับไฟล์ทั้งหมด
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tseslint.plugin,
      react: reactRecommended.plugins.react,
      "react-hooks": reactHooksPlugin,
      "simple-import-sort": importSortPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // --- เปิดใช้งานกฎที่แนะนำด้วยตัวเอง ---
      ...tseslint.configs.recommended.rules,
      ...reactRecommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // --- กฎที่คุณกำหนดเอง ---
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-unused-vars": "off",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^@?\\w"],
            ["^(@|components|hooks|libs|pages|services|store|ui|utils)(/.*|$)"],
            ["^\\u0000"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },

  // ปิดท้ายด้วย Prettier (ต้องอยู่ล่างสุดเสมอ)
  prettierConfig,
];

export default config;
