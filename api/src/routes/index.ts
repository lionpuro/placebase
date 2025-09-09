import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { CountrySchema } from "../schemas/index.js";
import { CountriesQuerySchema } from "../schemas/request.js";

const routes: FastifyPluginAsyncTypebox = async (server) => {
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
			params: Type.Object({ iso_code: Type.String() }),
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
};
export default routes;
