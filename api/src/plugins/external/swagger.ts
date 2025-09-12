import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";

export default fp(async (fastify) => {
	await fastify.register(swagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				title: "places-api",
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
	await fastify.register(scalar, {
		routePrefix: "/docs",
		configuration: {
			theme: "alternate",
			metaData: { title: "Places API" },
			defaultOpenAllTags: true,
		},
	});
});
