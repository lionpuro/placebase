import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { StateSchema } from "../schemas/index.js";
import {
	CountryCodeSchema,
	CountryStatesQuerySchema,
	StateCodeSchema,
	StatesQuerySchema,
} from "../schemas/request.js";

export default (async function (app) {
	app.route({
		method: "GET",
		url: "/states",
		schema: {
			summary: "All states",
			description: "List all states",
			tags: ["States"],
			querystring: StatesQuerySchema,
			response: {
				200: Type.Array(StateSchema),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, reply) => {
			try {
				const states = await app.stateRepository.find(req.query);
				return reply.code(200).send(states);
			} catch (err) {
				console.log(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
	app.route({
		method: "GET",
		url: "/countries/:iso_code/states",
		schema: {
			summary: "States by country",
			description: "List states by country",
			tags: ["States"],
			params: Type.Object({
				iso_code: CountryCodeSchema,
			}),
			querystring: CountryStatesQuerySchema,
			response: {
				200: Type.Array(StateSchema),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, reply) => {
			try {
				const states = await app.stateRepository.find({
					country: req.params.iso_code,
					...req.query,
				});
				return reply.code(200).send(states);
			} catch (err) {
				console.log(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
	app.route({
		method: "GET",
		url: "/countries/:country_code/states/:state_code",
		schema: {
			summary: "State details",
			description: "Find state details by its ISO2 code",
			tags: ["States"],
			params: Type.Object({
				country_code: CountryCodeSchema,
				state_code: StateCodeSchema,
			}),
			response: {
				200: StateSchema,
				404: Type.Object({ message: Type.String() }),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, reply) => {
			try {
				const [state] = await app.stateRepository.find({
					country: req.params.country_code,
					iso_code: req.params.state_code,
				});
				if (!state) {
					return reply.code(404).send({ message: "Not found" });
				}
				return reply.code(200).send(state);
			} catch (err) {
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
} satisfies FastifyPluginAsyncTypebox);
