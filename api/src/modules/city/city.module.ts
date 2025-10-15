import type { FastifyPluginAsync } from "fastify";
import cityRepository from "./city.repository.js";
import cityRoutes from "./city.routes.js";

export default (async function (app) {
	app.register(cityRepository);
	app.register(cityRoutes);
} satisfies FastifyPluginAsync);
