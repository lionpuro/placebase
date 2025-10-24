import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import {
	CountryRegionsQuerySchema,
	RegionSchema,
	RegionsQuerySchema,
	RegionsSchema,
} from "./region.schema.js";
import {
	CountryCodeSchema,
	ErrorResponseSchema,
	RegionCodeSchema,
} from "../../lib/schemas/common.js";

export default (async function (app) {
	app.route({
		method: "GET",
		url: "/regions",
		schema: {
			summary: "All regions",
			description: "List all regions",
			tags: ["Regions"],
			querystring: RegionsQuerySchema,
			response: {
				200: RegionsSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			try {
				const regions = await app.regionRepository.find(req.query);
				return reply.code(200).send(regions);
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
	app.route({
		method: "GET",
		url: "/countries/:country_code/regions",
		schema: {
			summary: "Regions by country",
			description: "List regions by country",
			tags: ["Regions"],
			params: Type.Object({
				country_code: CountryCodeSchema,
			}),
			querystring: CountryRegionsQuerySchema,
			response: {
				200: RegionsSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			try {
				const regions = await app.regionRepository.find({
					country: req.params.country_code,
					...req.query,
				});
				return reply.code(200).send(regions);
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
	app.route({
		method: "GET",
		url: "/countries/:country_code/regions/:region_code",
		schema: {
			summary: "Region details",
			description: "Find region details by its ISO2 code",
			tags: ["Regions"],
			params: Type.Object({
				country_code: CountryCodeSchema,
				region_code: RegionCodeSchema,
			}),
			response: {
				200: RegionSchema,
				404: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			try {
				const [region] = await app.regionRepository.find({
					country: req.params.country_code,
					iso_code: req.params.region_code,
				});
				if (!region) {
					return reply.code(404).send({ message: "Not found" });
				}
				return reply.code(200).send(region);
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
} satisfies FastifyPluginAsyncTypebox);
