import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import icons from "unplugin-icons/vite";
import basicSSL from "@vitejs/plugin-basic-ssl";

export default defineConfig(({ mode }) => {
	process.env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [
			tailwindcss(),
			sveltekit(),
			icons({ compiler: "svelte" }),
			basicSSL({
				name: "development",
			}),
		],
		server: {
			proxy: {
				"/api/": {
					target: "http://localhost:3000/",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
				"/__/auth/": {
					target: `https://${process.env.PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com/`,
					changeOrigin: true,
				},
			},
		},
	};
});
