import fp from "fastify-plugin";
import swagger from "@fastify/swagger";

export default fp(async (fastify) => {
	await fastify.register(swagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				title: "Placebase",
				description: "API for querying country-state-city data",
				version: "1.0.0",
			},
			tags: [
				{ name: "Countries", description: "Country endpoints" },
				{ name: "States", description: "State endpoints" },
				{ name: "Cities", description: "City endpoints" },
			],
		},
	});
	fastify.route({
		method: "GET",
		url: "/openapi.json",
		schema: { hide: true },
		handler: async (_request, reply) => {
			reply.send(fastify.swagger());
		},
	});
});
