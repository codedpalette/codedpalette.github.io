/** @type { import("eslint").Linter.FlatConfig } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:svelte/recommended',
		'plugin:compat/recommended',
		'plugin:ecmascript-compat/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'compat',
		'ecmascript-compat',
		'import',
		'unused-imports',
		'simple-import-sort'
	],
	parserOptions: {
		sourceType: 'module',
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2020: true,
		node: true
	},
	settings: {
		// https://github.com/import-js/eslint-plugin-import/tree/main#typescript
		'import/resolver': { typescript: true }
	},
	rules: {
		// https://github.com/lydell/eslint-plugin-simple-import-sort/#example-configuration
		'simple-import-sort/imports': 'warn',
		'simple-import-sort/exports': 'warn',
		'import/first': 'warn',
		'import/newline-after-import': 'warn',
		'import/no-duplicates': 'warn',

		'import/no-unresolved': ['error', { ignore: ['\\$app/*'] }],

		// https://github.com/sweepline/eslint-plugin-unused-imports#usage
		'@typescript-eslint/no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'unused-imports/no-unused-vars': [
			'warn',
			{ vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
		]
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
