import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
	{
		ignores: ["dist_commonjs/**", "dist_es6/**", "coverage/**"],
	},
	eslint.configs.recommended,
	{
		files: ["**/*.{js,ts}"],
		languageOptions: {
			parser: tseslintParser,
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				setTimeout: "readonly",
				clearTimeout: "readonly",
				setInterval: "readonly",
				clearInterval: "readonly",
				console: "readonly",
				window: "readonly",
				document: "readonly",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
			prettier: prettier,
		},
		rules: {
			"prettier/prettier": "warn",
			"no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			...tseslint.configs.recommended.rules,
			...eslintConfigPrettier.rules,
		},
	},
	{
		files: ["**/*.spec.{js,ts}", "**/*.test.{js,ts}"],
		languageOptions: {
			globals: {
				describe: "readonly",
				it: "readonly",
				expect: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
				beforeAll: "readonly",
				afterAll: "readonly",
				jest: "readonly",
			},
		},
	},
];
