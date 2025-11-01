import {
	Type,
	type FastifyPluginAsyncTypebox,
} from "@fastify/type-provider-typebox";
import { AuthHeaders, ErrorResponseSchema } from "../../lib/schemas/common.js";
import { firebase } from "../../lib/firebase.js";
import { ErrorForbidden } from "../../lib/errors.js";

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
				400: ErrorResponseSchema,
				403: ErrorResponseSchema,
			},
		},
		preHandler: [app.authenticate],
		handler: async (req, reply) => {
			if (req.params.id !== req.user.id) {
				throw new ErrorForbidden();
			}
			const uid = req.user.id;
			await firebase.auth().deleteUser(uid);
			await app.apikeyService.deleteByUser(uid);
			return reply.code(204).send();
		},
	});
} satisfies FastifyPluginAsyncTypebox);
