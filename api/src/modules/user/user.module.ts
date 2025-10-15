import type { FastifyPluginAsync } from "fastify";
import userRoutes from "./user.routes.js";

export default (async function (app) {
	await app.register(userRoutes, { prefix: "/internal" });
} satisfies FastifyPluginAsync);
