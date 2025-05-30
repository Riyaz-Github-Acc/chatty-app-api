import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {
            js,
            "simple-import-sort": simpleImportSort,
        },
        extends: ["js/recommended"],
        rules: {
            "simple-import-sort/imports": "warn",
            "simple-import-sort/exports": "warn",
            "@typescript-eslint/no-unused-vars": ["warn",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        languageOptions: {
            globals: globals.browser,
        },
    },
    tseslint.configs.recommended,
]);
