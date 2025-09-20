import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		authenticator: Authenticator;
	}
	interface FastifyRequest {
		user: User;
	}
}

type User = {
	id: string;
};

type Middleware = <T extends FastifyRequest, U extends FastifyReply>(
	req: T,
	res: U,
) => void;

type Authenticator = {
	verifyToken: Middleware;
};

export function createAuthenticator(app: FastifyInstance): Authenticator {
	return {
		async verifyToken(req, res) {
			const token = req.headers.authorization?.match(/^[Bb]earer (\S+)/)?.[1];
			if (!token) {
				return res.code(401).send({ message: "Unauthorized" });
			}
			try {
				const decoded = await app.firebase.auth().verifyIdToken(token);
				if (!decoded.uid || !decoded.email) {
					return res.code(401).send({ message: "Unauthorized" });
				}
				const user: User = {
					id: decoded.uid,
				};
				req.user = user;
			} catch (err) {
				return res.code(401).send({ message: "Unauthorized" });
			}
		},
	};
}

export default fp((fastify) => {
	fastify.decorate("authenticator", createAuthenticator(fastify));
});
