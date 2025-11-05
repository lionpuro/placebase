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
import { ErrorNotFound } from "../../lib/errors.js";

export default (async function (app) {
	app.route({
		method: "GET",
		url: "/regions",
		schema: {
			summary: "All Regions",
			description: "List all regions",
			tags: ["Regions"],
			querystring: RegionsQuerySchema,
			response: {
				200: RegionsSchema,
				400: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			const regions = await app.regionRepository.find(req.query);
			return reply.code(200).send(regions);
		},
	});
	app.route({
		method: "GET",
		url: "/countries/:country_code/regions",
		schema: {
			summary: "Regions by Country",
			description: "Retrieve all regions within a specified country",
			tags: ["Regions"],
			params: Type.Object({
				country_code: CountryCodeSchema,
			}),
			querystring: CountryRegionsQuerySchema,
			response: {
				200: RegionsSchema,
				400: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			const regions = await app.regionRepository.find({
				country: req.params.country_code,
				...req.query,
			});
			return reply.code(200).send(regions);
		},
	});
	app.route({
		method: "GET",
		url: "/countries/:country_code/regions/:region_code",
		schema: {
			summary: "Region Details",
			description: "Retrieve region details by its ISO2 code",
			tags: ["Regions"],
			params: Type.Object({
				country_code: CountryCodeSchema,
				region_code: RegionCodeSchema,
			}),
			response: {
				200: RegionSchema,
				400: ErrorResponseSchema,
				404: ErrorResponseSchema,
			},
		},
		handler: async (req, reply) => {
			const [region] = await app.regionRepository.find({
				country: req.params.country_code,
				iso_code: req.params.region_code,
			});
			if (!region) {
				throw new ErrorNotFound();
			}
			return reply.code(200).send(region);
		},
	});
} satisfies FastifyPluginAsyncTypebox);
