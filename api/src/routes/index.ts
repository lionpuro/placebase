import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { CitySchema, CountrySchema, StateSchema } from "../schemas/index.js";
import {
	CitiesQuerySchema,
	CountriesQuerySchema,
	CountryCodeSchema,
	CountryStateCitiesQuerySchema,
	CountryStatesQuerySchema,
	StateCodeSchema,
	StatesQuerySchema,
} from "../schemas/request.js";

const routes: FastifyPluginAsyncTypebox = async (server) => {
	// countries
	server.route({
		method: "GET",
		url: "/countries",
		schema: {
			summary: "All countries",
			description: "List countries",
			tags: ["Countries"],
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
		url: "/states",
		schema: {
			summary: "All states",
			description: "List all states",
			tags: ["States"],
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
	server.route({
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

	// cities
	server.route({
		method: "GET",
		url: "/cities",
		schema: {
			summary: "All cities",
			description: "List all cities",
			tags: ["Cities"],
			querystring: CitiesQuerySchema,
			response: {
				200: Type.Array(CitySchema),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, res) => {
			try {
				const cities = await server.cityRepository.find(req.query);
				return res.code(200).send(cities);
			} catch (err) {
				console.log(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
	server.route({
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
				200: Type.Array(CitySchema),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, res) => {
			try {
				const cities = await server.cityRepository.find({
					country: req.params.country_code,
					state: req.params.state_code,
					...req.query,
				});
				return res.code(200).send(cities);
			} catch (err) {
				console.log(err);
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
};
export default routes;
