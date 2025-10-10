import Fastify, { type LogLevel } from "fastify";
import autoload from "@fastify/autoload";
import path from "node:path";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

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
		dir: path.join(import.meta.dirname, "plugins/external"),
	});
	await app.register(autoload, {
		dir: path.join(import.meta.dirname, "plugins/app"),
	});
	await app.register(autoload, {
		dir: path.join(import.meta.dirname, "routes"),
		ignorePattern: /^.*(?:test|spec).(js|ts)$/,
		autoHooks: true,
		cascadeHooks: true,
	});
}
