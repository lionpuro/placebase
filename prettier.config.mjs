/**
 * @type {import("prettier").Config}
 */
const config = {
	semi: true,
	useTabs: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 80,
	plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	overrides: [
		{
			files: "*.svelte",
			options: {
				printWidth: 100,
				parser: "svelte",
			},
		},
	],
	tailwindStylesheet: "./web/src/app.css",
};

export default config;
