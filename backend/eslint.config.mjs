import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // Enabling Prettier Plugin
    plugins: { prettier: prettierPlugin },
    // Adding the Prettier plugin and integrating it
    extends: ["react-app", "plugin:prettier/recommended"],
    // Custom rules to integrate Prettier with ESLint
    rules: {
      // Enforcing Prettier as an ESLint rule
      "prettier/prettier": "error",
      // You can override specific rules from ESLint here if needed
      // e.g., "semi": ["error", "always"],
    },
  },
];
