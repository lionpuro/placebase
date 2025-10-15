import type { FastifyPluginAsync } from "fastify";
import countryRepository from "./country.repository.js";
import countryRoutes from "./country.routes.js";

export default (async function (app) {
	app.register(countryRepository);
	app.register(countryRoutes);
} satisfies FastifyPluginAsync);
