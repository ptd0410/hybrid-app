export default defineConfig([
  globalIgnores([
    "**/dist/**",
    "**/node_modules/**",
    "**/.wrangler/**",
    "**/coverage/**",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-empty-pattern": "off",
    },
  },
  {
    files: [
      "apps/web/**/*.{ts,tsx}",
      "apps/home/**/*.{ts,tsx}",
      "apps/file-manager/**/*.{ts,tsx}",
    ],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-empty-pattern": "off",
    },
  },
]);
