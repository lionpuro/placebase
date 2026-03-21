import Fastify, { type LogLevel } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import autoload from "@fastify/autoload";
import path from "node:path";
import auth from "./plugins/apikey-auth.js";
import type { APIKeyModuleOptions } from "./modules/apikey/apikey.module.js";
import { HTTPError, schemaErrorFormatter } from "./lib/errors.js";

type AppOptions = {
	logger: boolean | { level: LogLevel };
	modules: ModulesConfig;
};

interface ModulesConfig extends APIKeyModuleOptions {}

const defaults: AppOptions = {
	logger: { level: process.env.LOG_LEVEL || "info" },
	modules: {},
};

export async function createApp(opts: Partial<AppOptions> = {}) {
	const options = { ...defaults, ...opts };
	const app = Fastify(options).withTypeProvider<TypeBoxTypeProvider>();

	app.setSchemaErrorFormatter(schemaErrorFormatter);
	app.setErrorHandler((error, request, reply) => {
		if (error instanceof HTTPError) {
			reply.code(error.status).send({ message: error.message });
			return;
		}
		if (request.validationError) {
			reply.code(400).send({ message: request.validationError.message });
			return;
		}
		app.log.error(error);
		reply.code(500).send({ message: "Internal Server Error" });
	});
	app.setNotFoundHandler((_request, reply) => {
		return reply.status(404).send({ message: "Not Found" });
	});

	await app.register(autoload, {
		dir: path.join(import.meta.dirname, "plugins"),
		ignorePattern: /^.*apikey-auth\.(js|ts)$/,
	});
	await app.register(auth, {
		ignorePattern: /^\/internal\/.*$/,
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
