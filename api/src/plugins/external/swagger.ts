import fp from "fastify-plugin";
import swagger from "@fastify/swagger";

declare module "fastify" {
	interface FastifyInstance {
		swaggerInternal: FastifyInstance["swagger"];
	}
}

export default fp(async (fastify) => {
	// Public API
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
		transform: ({ schema, url }) => {
			if (url.startsWith("/internal")) {
				schema.hide = true;
			}

			return { schema: schema, url: url };
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

	// Internal API
	await fastify.register(swagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				title: "Placebase internal",
				version: "1.0.0",
			},
			tags: [{ name: "Users", description: "Auth user endpoints" }],
		},
		transform: ({ schema, url }) => {
			if (!url.startsWith("/internal")) {
				schema.hide = true;
			}

			return { schema: schema, url: url };
		},
		decorator: "swaggerInternal",
	});
	fastify.route({
		method: "GET",
		url: "/internal/openapi.json",
		schema: { hide: true },
		handler: async (_request, reply) => {
			reply.send(fastify.swaggerInternal());
		},
	});
});
