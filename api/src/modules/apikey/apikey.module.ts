import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import apikeyService from "./apikey.service.js";
import apikeyRepository from "./apikey.repository.js";
import apikeyRoutes from "./apikey.routes.js";

export default fp(async function (app) {
	app.register(apikeyRepository);
	app.register(apikeyService);
	app.register(apikeyRoutes, { prefix: "/internal" });
} satisfies FastifyPluginAsync);
