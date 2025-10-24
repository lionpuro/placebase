import type { FastifyPluginAsync } from "fastify";
import regionRepository from "./region.repository.js";
import regionRoutes from "./region.routes.js";

export default (async function (app) {
	app.register(regionRepository);
	app.register(regionRoutes);
} satisfies FastifyPluginAsync);
