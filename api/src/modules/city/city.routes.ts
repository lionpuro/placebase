import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import {
	CitiesQuerySchema,
	CitiesSchema,
	CountryRegionCitiesQuerySchema,
} from "./city.schema.js";
import {
	CountryCodeSchema,
	ErrorResponseSchema,
	RegionCodeSchema,
} from "../../lib/schemas/common.js";

export default (async function (app) {
	app.route({
		method: "GET",
		url: "/cities",
		schema: {
			summary: "All cities",
			description: "List all cities",
			tags: ["Cities"],
			querystring: CitiesQuerySchema,
			response: {
				200: CitiesSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			try {
				const cities = await app.cityRepository.find(req.query);
				return reply.code(200).send(cities);
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
	app.route({
		method: "GET",
		url: "/countries/:country_code/regions/:region_code/cities",
		schema: {
			summary: "Cities by region",
			description: "Get a list of cities by country and region",
			tags: ["Cities"],
			params: Type.Object({
				country_code: CountryCodeSchema,
				region_code: RegionCodeSchema,
			}),
			querystring: CountryRegionCitiesQuerySchema,
			response: {
				200: CitiesSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			try {
				const cities = await app.cityRepository.find({
					country: req.params.country_code,
					region: req.params.region_code,
					...req.query,
				});
				return reply.code(200).send(cities);
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
} satisfies FastifyPluginAsyncTypebox);
