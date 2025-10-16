import Fastify, { type LogLevel } from "fastify";
import autoload from "@fastify/autoload";
import path from "node:path";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import auth from "./hooks/auth.js";

type AppOptions = {
	logger: boolean | { level: LogLevel };
};

const defaults: AppOptions = {
	logger: { level: process.env.LOG_LEVEL || "info" },
};

export function createApp(opts: Partial<AppOptions> = {}) {
	const app = Fastify({
		...defaults,
		...opts,
	}).withTypeProvider<TypeBoxTypeProvider>();
	return app;
}

export async function registerPlugins(app: ReturnType<typeof createApp>) {
	await app.register(autoload, {
		dir: path.join(import.meta.dirname, "plugins"),
	});
	await app.register(auth, {
		ignorePrefix: ["/internal"],
		ignoreSuffix: ["openapi.json"],
	});
	await app.register(autoload, {
		dir: path.join(import.meta.dirname, "modules"),
		maxDepth: 1,
		dirNameRoutePrefix: false,
		matchFilter: /^.*\.module\.(js|ts)$/,
	});
}
