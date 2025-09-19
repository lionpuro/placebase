import {
	Type,
	type FastifyPluginAsyncTypebox,
} from "@fastify/type-provider-typebox";
import { ErrorResponseSchema } from "../schemas/response.js";

const Headers = Type.Object({
	Authorization: Type.String({
		description: "Firebase auth ID token",
		examples: ["Bearer <token>"],
	}),
});

export default (async function (app) {
	app.route({
		method: "POST",
		url: "/internal/users",
		schema: {
			summary: "Create user",
			description: "Create user",
			tags: ["Users"],
			headers: Headers,
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
		url: "/internal/users/:id",
		schema: {
			summary: "Delete user",
			description: "Delete currently authenticated user",
			tags: ["Users"],
			params: Type.Object({ id: Type.String() }),
			headers: Headers,
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
				await app.userRepository.delete(req.user.id);
				await app.firebase.auth().deleteUser(req.user.id);
				return reply.code(201).send();
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
} satisfies FastifyPluginAsyncTypebox);
