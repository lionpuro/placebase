import type { FastifyPluginAsync } from "fastify";
import stateRepository from "./state.repository.js";
import stateRoutes from "./state.routes.js";

export default (async function (app) {
	app.register(stateRepository);
	app.register(stateRoutes);
} satisfies FastifyPluginAsync);
