import {
	Type,
	type FastifyPluginAsyncTypebox,
} from "@fastify/type-provider-typebox";
import { ErrorResponseSchema } from "../../schemas/response.js";
import { AuthHeaders } from "../../schemas/request.js";

export default (async function (app) {
	app.route({
		method: "POST",
		url: "/users",
		config: { cors: false },
		schema: {
			summary: "Create user",
			description: "Create user",
			tags: ["Users"],
			headers: AuthHeaders,
			response: {
				201: Type.Null(),
				500: ErrorResponseSchema,
			},
		},
		preHandler: [app.authenticator.verifyToken],
		handler: async (req, reply) => {
			try {
				await app.userRepository.create(req.user.id);
				return reply.code(201).send();
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
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
				201: Type.Null(),
				401: ErrorResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		preHandler: [app.authenticator.verifyToken],
		handler: async (req, reply) => {
			try {
				if (req.params.id !== req.user.id) {
					return reply.code(401).send({ message: "Internal server error" });
				}
				const uid = req.user.id;
				await app.userRepository.delete(uid);
				await app.firebase.auth().deleteUser(uid);
				try {
					await app.keyRepository.deleteByUser(uid);
				} catch (err) {
					app.log.error(err, "failed to delete user api keys");
				}
				return reply.code(201).send();
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
} satisfies FastifyPluginAsyncTypebox);
