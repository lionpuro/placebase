import fp from "fastify-plugin";
import swagger from "@fastify/swagger";

declare module "fastify" {
	interface FastifyInstance {
		swaggerInternal: FastifyInstance["swagger"];
	}
}

export default fp(async (app) => {
	// Public API
	await app.register(swagger, {
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
			components: {
				securitySchemes: {
					api_key: {
						type: "apiKey",
						name: "X-API-KEY",
						in: "header",
					},
				},
			},
			security: [{ api_key: [] }],
		},
		transform: ({ schema, url }) => {
			if (url.startsWith("/internal")) {
				schema.hide = true;
			}

			return { schema: schema, url: url };
		},
	});
	app.route({
		method: "GET",
		url: "/openapi.json",
		schema: { hide: true },
		handler: async (_request, reply) => {
			reply.send(app.swagger());
		},
	});

	// Internal API
	await app.register(swagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				title: "Placebase internal",
				version: "1.0.0",
			},
			tags: [{ name: "Users", description: "User endpoints" }],
		},
		transform: ({ schema, url }) => {
			if (!url.startsWith("/internal")) {
				schema.hide = true;
			}

			return { schema: schema, url: url };
		},
		decorator: "swaggerInternal",
	});
	app.route({
		method: "GET",
		url: "/internal/openapi.json",
		schema: { hide: true },
		handler: async (_request, reply) => {
			reply.send(app.swaggerInternal());
		},
	});
});
