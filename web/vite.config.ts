import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import icons from "unplugin-icons/vite";

export default defineConfig(({ mode }) => {
	process.env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [tailwindcss(), sveltekit(), icons({ compiler: "svelte" })],
		server: {
			proxy: {
				"/api/": {
					target: "http://localhost:3000/",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
		},
	};
});
