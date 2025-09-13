import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { CitiesSchema } from "../schemas/index.js";
import {
	CitiesQuerySchema,
	CountryCodeSchema,
	CountryStateCitiesQuerySchema,
	StateCodeSchema,
} from "../schemas/request.js";
import { ErrorResponseSchema } from "../schemas/response.js";

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
		url: "/countries/:country_code/states/:state_code/cities",
		schema: {
			summary: "Cities by country and state",
			description: "List cities by country and state",
			tags: ["Cities"],
			params: Type.Object({
				country_code: CountryCodeSchema,
				state_code: StateCodeSchema,
			}),
			querystring: CountryStateCitiesQuerySchema,
			response: {
				200: CitiesSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			try {
				const cities = await app.cityRepository.find({
					country: req.params.country_code,
					state: req.params.state_code,
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
