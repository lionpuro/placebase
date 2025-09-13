import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { CountriesSchema, CountrySchema } from "../schemas/index.js";
import { CountriesQuerySchema, CountryCodeSchema } from "../schemas/request.js";

export default (async function (app) {
	app.route({
		method: "GET",
		url: "/countries",
		schema: {
			summary: "All countries",
			description: "List countries",
			tags: ["Countries"],
			querystring: CountriesQuerySchema,
			response: {
				200: CountriesSchema,
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, reply) => {
			try {
				const countries = await app.countryRepository.find(req.query);
				return reply.code(200).send(countries);
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
	app.route({
		method: "GET",
		url: "/countries/:iso_code",
		schema: {
			summary: "Country details",
			description: "Find country details by its ISO2 code",
			tags: ["Countries"],
			params: Type.Object({ iso_code: CountryCodeSchema }),
			response: {
				200: CountrySchema,
				404: Type.Object({ message: Type.String() }),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, reply) => {
			try {
				const [country] = await app.countryRepository.find({
					iso_code: req.params.iso_code,
				});
				if (!country) {
					return reply.code(404).send({ message: "Not found" });
				}
				return reply.code(200).send(country);
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
} satisfies FastifyPluginAsyncTypebox);
