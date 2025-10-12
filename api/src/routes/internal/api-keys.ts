import {
	Type,
	type FastifyPluginAsyncTypebox,
} from "@fastify/type-provider-typebox";
import {
	APIKeyRecordSchema,
	CreateAPIKeyRequestSchema,
	CreateAPIKeyResponseSchema,
} from "../../schemas/api-key.js";
import { AuthHeaders, ErrorResponseSchema } from "../../schemas/common.js";

export default (async function (app) {
	app.route({
		method: "GET",
		url: "/api-keys",
		config: { cors: false },
		schema: {
			summary: "List API keys",
			description: "List API key records",
			tags: ["API-Keys"],
			headers: AuthHeaders,
			response: {
				200: Type.Array(APIKeyRecordSchema),
				500: ErrorResponseSchema,
			},
		},
		preHandler: [app.firebaseAuth.verifyToken],
		handler: async (req, reply) => {
			try {
				const records = await app.keyRepository.byUser(req.user.id);
				return reply.code(200).send(records);
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
	app.route({
		method: "POST",
		url: "/api-keys",
		config: { cors: false },
		schema: {
			summary: "Generate API key",
			description: "Generate a new API key",
			tags: ["API-Keys"],
			headers: AuthHeaders,
			body: CreateAPIKeyRequestSchema,
			response: {
				200: CreateAPIKeyResponseSchema,
				500: ErrorResponseSchema,
			},
		},
		preHandler: [app.firebaseAuth.verifyToken],
		handler: async (req, reply) => {
			try {
				const key = await app.apikeyAuth.createAPIKey(
					req.user.id,
					req.body.name,
				);
				return reply.code(200).send({ api_key: key });
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
	app.route({
		method: "DELETE",
		url: "/api-keys/:id",
		config: { cors: false },
		schema: {
			summary: "Delete API key",
			description: "Delete API key",
			tags: ["API-Keys"],
			headers: AuthHeaders,
			params: Type.Object({ id: Type.String() }),
			response: {
				204: Type.Null(),
				500: ErrorResponseSchema,
			},
		},
		preHandler: [app.firebaseAuth.verifyToken],
		handler: async (req, reply) => {
			try {
				await app.keyRepository.delete(req.params.id, req.user.id);
				return reply.code(204).send();
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Internal server error" });
			}
		},
	});
} satisfies FastifyPluginAsyncTypebox);
