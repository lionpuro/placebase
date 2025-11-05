import type {
	FastifyInstance,
	FastifyPluginOptions,
	FastifyReply,
	FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";
import { ErrorResponseSchema } from "../lib/schemas/common.js";

interface AuthOptions extends FastifyPluginOptions {
	ignorePattern?: RegExp;
}

type Middleware = <T extends FastifyRequest, U extends FastifyReply>(
	request: T,
	reply: U,
) => void;

function createHandler(app: FastifyInstance): Middleware {
	return async (request, reply) => {
		const header = request.headers["x-api-key"];
		if (!header) {
			return reply.code(401).send({ message: "Missing API key" });
		}
		const key = typeof header === "string" ? header : header[0];
		if (!key) {
			return reply.code(401).send({ message: "Missing API key" });
		}
		try {
			const valid = await app.apikeyService.verify(key);
			if (!valid) {
				return reply.code(401).send({ message: "Invalid API key" });
			}
		} catch (err) {
			app.log.error(err);
			return reply.code(500).send({ message: "Failed to verify API key" });
		}
	};
}

function auth(app: FastifyInstance, opts: AuthOptions) {
	app.addHook("onRoute", (routeOpts) => {
		const { url, preHandler, schema } = routeOpts;
		const ignore = opts.ignorePattern;
		if (ignore) {
			const skip = ignore.test(url);
			if (skip) {
				return;
			}
		}
		if (schema?.response) {
			schema.response = { ...schema.response, 401: ErrorResponseSchema };
		}
		const handler = createHandler(app);
		if (!preHandler) {
			routeOpts.preHandler = [handler];
			return;
		}
		if (Array.isArray(preHandler)) {
			routeOpts.preHandler = [handler, ...preHandler];
			return;
		}
		routeOpts.preHandler = [handler, preHandler];
	});
}

export default fp(auth);
