import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

interface AuthOptions extends FastifyPluginOptions {
	ignorePrefix?: string[];
	ignoreSuffix?: string[];
}

function auth(app: FastifyInstance, opts: AuthOptions) {
	app.addHook("onRequest", async (request, reply) => {
		if (opts.ignorePrefix?.some((s) => request.url.startsWith(s))) {
			return;
		}
		if (opts.ignoreSuffix?.some((s) => request.url.endsWith(s))) {
			return;
		}
		const header = request.headers["x-api-key"];
		if (!header) {
			return reply.code(401).send({ message: "Missing API key" });
		}
		const key = typeof header === "string" ? header : header[0];
		if (!key) {
			return reply.code(401).send({ message: "Missing API key" });
		}
		try {
			const valid = await app.apikeyService.verify(key);
			if (!valid) {
				return reply.code(401).send({ message: "Invalid API key" });
			}
		} catch (err) {
			app.log.error(err);
			return reply.code(500).send({ message: "Failed to verify API key" });
		}
	});
}

export default fp(auth, { decorators: { fastify: ["apikeyService"] } });
