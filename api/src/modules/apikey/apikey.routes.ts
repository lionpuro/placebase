import {
	Type,
	type FastifyPluginAsyncTypebox,
} from "@fastify/type-provider-typebox";
import {
	APIKeyRecordSchema,
	CreateAPIKeyRequestSchema,
	CreateAPIKeyResponseSchema,
} from "./apikey.schema.js";
import { AuthHeaders, ErrorResponseSchema } from "../../lib/schemas/common.js";

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
			},
		},
		preHandler: [app.authenticate],
		handler: async (req, reply) => {
			const records = await app.apikeyService.byUser(req.user.id);
			return reply.code(200).send(records);
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
				400: ErrorResponseSchema,
			},
		},
		preHandler: [app.authenticate],
		handler: async (req, reply) => {
			const key = await app.apikeyService.create(req.user.id, req.body.name);
			return reply.code(200).send({ api_key: key });
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
				404: ErrorResponseSchema,
				400: ErrorResponseSchema,
			},
		},
		preHandler: [app.authenticate],
		handler: async (req, reply) => {
			await app.apikeyService.delete(req.params.id, req.user.id);
			return reply.code(204).send(null);
		},
	});
} satisfies FastifyPluginAsyncTypebox);
