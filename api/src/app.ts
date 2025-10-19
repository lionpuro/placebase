import Fastify, { type LogLevel } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import autoload from "@fastify/autoload";
import path from "node:path";
import auth from "./plugins/apikey-auth.js";
import type { APIKeyModuleOptions } from "./modules/apikey/apikey.module.js";

type AppOptions = {
	logger: boolean | { level: LogLevel };
	modules: ModulesConfig;
};

interface ModulesConfig extends APIKeyModuleOptions {}

const defaults: AppOptions = {
	logger: { level: process.env.LOG_LEVEL || "info" },
	modules: { apikey: {} },
};

export async function createApp(opts: Partial<AppOptions> = {}) {
	const options = { ...defaults, ...opts };
	const app = Fastify(options).withTypeProvider<TypeBoxTypeProvider>();

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
		options: options.modules,
	});
	return app;
}
