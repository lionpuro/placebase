import type { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import apikeyService from "./apikey.service.js";
import {
	type APIKeyRepository,
	createAPIKeyRepository,
} from "./apikey.repository.js";
import apikeyRoutes from "./apikey.routes.js";

export interface APIKeyModuleOptions extends FastifyPluginOptions {
	apikey?: {
		repository?: APIKeyRepository;
	};
}

export default fp(async function (app, opts) {
	const repository = opts?.apikey?.repository || createAPIKeyRepository();
	app.register(apikeyService, { repository: repository });
	app.register(apikeyRoutes, { prefix: "/internal" });
} satisfies FastifyPluginAsync<APIKeyModuleOptions>);
