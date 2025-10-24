import fp from "fastify-plugin";
import swagger from "@fastify/swagger";

declare module "fastify" {
	interface FastifyInstance {
		swaggerInternal: FastifyInstance["swagger"];
	}
}

export default fp(async (app) => {
	// Public API
	const servers = [];
	if (process.env.API_URL) {
		servers.push({ url: process.env.API_URL });
	}
	await app.register(swagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				title: "Placebase",
				description: "API for querying country-region-city data",
				version: "1.0.0",
			},
			servers: servers,
			tags: [
				{ name: "Countries", description: "Country endpoints" },
				{ name: "Regions", description: "Region endpoints" },
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
			const transformed = { ...schema };
			if (url.startsWith("/internal") || url.endsWith("openapi.json")) {
				transformed.hide = true;
			}
			return { schema: transformed, url: url };
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
			tags: [
				{ name: "Users", description: "User endpoints" },
				{ name: "API-Keys", description: "API key management endpoints" },
			],
		},
		transform: ({ schema, url }) => {
			const transformed = { ...schema };
			if (url.startsWith("/internal") && !url.endsWith("openapi.json")) {
				transformed.hide = false;
			} else {
				transformed.hide = true;
			}
			return { schema: transformed, url: url };
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
