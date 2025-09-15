// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	trailingSlash: "never",
	devToolbar: {
		enabled: false,
	},
	vite: {
		plugins: [tailwindcss()],
		server: {
			proxy: {
				"/api": {
					target: "http://localhost:3000/",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
		},
	},
});
