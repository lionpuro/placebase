import type {
	FastifyInstance,
	FastifyPluginOptions,
	FastifyReply,
	FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";

interface AuthOptions extends FastifyPluginOptions {
	ignorePrefix?: string[];
	ignoreSuffix?: string[];
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
		const { url, preHandler } = routeOpts;
		if (opts.ignorePrefix?.some((s) => url.startsWith(s))) {
			return;
		}
		if (opts.ignoreSuffix?.some((s) => url.endsWith(s))) {
			return;
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
