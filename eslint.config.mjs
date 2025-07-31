import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  // การกำหนดค่าใช้ได้กับไฟล์ทั้งหมด
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": simpleImportSort,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // เปิดใช้งานกฎที่แนะนำ
      ...tsPlugin.configs["recommended"].rules,
      ...reactPlugin.configs["recommended"].rules,
      ...reactHooksPlugin.configs["recommended"].rules,
      ...nextPlugin.configs["recommended"].rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // ปิดกฎของ ESLint ที่ไม่จำเป็นสำหรับ React 17+
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // กฎที่คัดลอกมาจากโปรเจกต์เก่าของคุณ
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",

      // กฎการเรียง import ที่ซับซ้อนจากโปรเจกต์เก่า
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^\\w", "^@hookform", "^@radix-ui"],
            ["^@store(/.*|$)"],
            ["^@components(/.*|$)"],
            ["^@ui(/.*|$)"],
            ["^@lib(/.*|$)"],
            ["^@pages(/.*|$)"],
            ["^@utils(/.*|$)"],
            ["^@hooks(/.*|$)"],
            ["^@services(/.*|$)"],
            ["^\\u0000"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.?(css)$"],
          ],
        },
      ],
    },
  },

  // ปิดกฎที่ขัดแย้งกับ Prettier (ต้องอยู่ตัวสุดท้ายเสมอ)
  eslintConfigPrettier,
];

export default config;
