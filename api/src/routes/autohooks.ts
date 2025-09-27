import type { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
	app.addHook("onRequest", async (request, reply) => {
		if (
			request.url.startsWith("/internal") ||
			request.url.endsWith("openapi.json")
		) {
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
			const valid = await app.apiAuth.verifyAPIKey(key);
			if (!valid) {
				return reply.code(401).send({ message: "Invalid API key" });
			}
		} catch (err) {
			app.log.error(err);
			return reply.code(500).send({ message: "Failed to verify API key" });
		}
	});
}
