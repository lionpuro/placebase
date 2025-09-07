import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const routes: FastifyPluginAsyncTypebox = async (server) => {
	server.route({
		method: "GET",
		url: "/",
		schema: {
			response: {
				200: Type.Object({ message: Type.String() }),
				500: Type.Object({ message: Type.String() }),
			},
		},
		handler: async (req, res) => {
			try {
				return res.code(200).send({ message: "Hello" });
			} catch (err) {
				return res.code(500).send({ message: "Internal server error" });
			}
		},
	});
};
export default routes;
