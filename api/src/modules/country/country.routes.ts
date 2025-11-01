import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import {
	CountriesSchema,
	CountrySchema,
	CountriesQuerySchema,
} from "./country.schema.js";
import {
	CountryCodeSchema,
	ErrorResponseSchema,
} from "../../lib/schemas/common.js";
import { ErrorNotFound } from "../../lib/errors.js";

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
				400: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			const countries = await app.countryRepository.find(req.query);
			return reply.code(200).send(countries);
		},
	});
	app.route({
		method: "GET",
		url: "/countries/:country_code",
		schema: {
			summary: "Country details",
			description: "Find country details by its ISO2 code",
			tags: ["Countries"],
			params: Type.Object({ country_code: CountryCodeSchema }),
			response: {
				200: CountrySchema,
				400: ErrorResponseSchema,
				404: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			const [country] = await app.countryRepository.find({
				iso_code: req.params.country_code,
			});
			if (!country) {
				throw new ErrorNotFound();
			}
			return reply.code(200).send(country);
		},
	});
} satisfies FastifyPluginAsyncTypebox);
