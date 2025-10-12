import {
	Type,
	type FastifyPluginAsyncTypebox,
} from "@fastify/type-provider-typebox";
import { AuthHeaders, ErrorResponseSchema } from "../../schemas/common.js";

export default (async function (app) {
	app.route({
		method: "DELETE",
		url: "/users/:id",
		config: { cors: false },
		schema: {
			summary: "Delete user",
			description: "Delete currently authenticated user",
			tags: ["Users"],
			params: Type.Object({ id: Type.String() }),
			headers: AuthHeaders,
			response: {
				204: Type.Null(),
				401: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		preHandler: [app.firebaseAuth.verifyToken],
		handler: async (req, reply) => {
			try {
				if (req.params.id !== req.user.id) {
					return reply.code(401).send({ message: "Unauthorized" });
				}
				const uid = req.user.id;
				await app.firebase.auth().deleteUser(uid);
				try {
					await app.keyRepository.deleteByUser(uid);
				} catch (err) {
					app.log.error(err, "failed to delete user api keys");
				}
				return reply.code(204).send();
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
} satisfies FastifyPluginAsyncTypebox);
