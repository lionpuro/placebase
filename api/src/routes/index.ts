import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { CountrySchema, StateSchema } from "../schemas/index.js";
import {
	CountriesQuerySchema,
	CountryCodeSchema,
	CountryStatesQuerySchema,
	StatesQuerySchema,
} from "../schemas/request.js";

const routes: FastifyPluginAsyncTypebox = async (server) => {
	// countries
	server.route({
		method: "GET",
		url: "/countries",
		schema: {
			querystring: CountriesQuerySchema,
			response: {
				200: Type.Array(CountrySchema),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, res) => {
			try {
				const countries = await server.countryRepository.find(req.query);
				return res.code(200).send(countries);
			} catch (err) {
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
	server.route({
		method: "GET",
		url: "/countries/:iso_code",
		schema: {
			params: Type.Object({ iso_code: CountryCodeSchema }),
			response: {
				200: CountrySchema,
				404: Type.Object({ message: Type.String() }),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, res) => {
			try {
				const [country] = await server.countryRepository.find({
					iso_code: req.params.iso_code,
				});
				if (!country) {
					return res.code(404).send({ message: "Not found" });
				}
				return res.code(200).send(country);
			} catch (err) {
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});

	// states
	server.route({
		method: "GET",
		url: "/countries/:iso_code/states",
		schema: {
			params: Type.Object({
				iso_code: CountryCodeSchema,
			}),
			querystring: CountryStatesQuerySchema,
			response: {
				200: Type.Array(StateSchema),
				404: Type.Object({ message: Type.String() }),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, res) => {
			try {
				const states = await server.stateRepository.find({
					country: req.params.iso_code,
					...req.query,
				});
				return res.code(200).send(states);
			} catch (err) {
				console.log(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
	server.route({
		method: "GET",
		url: "/states",
		schema: {
			querystring: StatesQuerySchema,
			response: {
				200: Type.Array(StateSchema),
				404: Type.Object({ message: Type.String() }),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, res) => {
			try {
				const states = await server.stateRepository.find(req.query);
				return res.code(200).send(states);
			} catch (err) {
				console.log(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
};
export default routes;
