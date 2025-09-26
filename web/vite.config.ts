import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import icons from "unplugin-icons/vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), icons({ compiler: "svelte" })],
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000/",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
