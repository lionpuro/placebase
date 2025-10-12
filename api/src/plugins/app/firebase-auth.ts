import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		firebaseAuth: FirebaseAuth;
	}
	interface FastifyRequest {
		user: User;
	}
}

type User = {
	id: string;
};

type Middleware = <T extends FastifyRequest, U extends FastifyReply>(
	request: T,
	reply: U,
) => void;

type FirebaseAuth = {
	verifyToken: Middleware;
};

export function createPlugin(app: FastifyInstance): FirebaseAuth {
	return {
		async verifyToken(req, reply) {
			const token = req.headers.authorization?.match(/^[Bb]earer (\S+)/)?.[1];
			if (!token) {
				return reply.code(401).send({ message: "Unauthorized" });
			}
			try {
				const decoded = await app.firebase.auth().verifyIdToken(token);
				if (!decoded.uid || !decoded.email) {
					return reply.code(401).send({ message: "Unauthorized" });
				}
				const user: User = {
					id: decoded.uid,
				};
				req.user = user;
			} catch (err) {
				return reply.code(401).send({ message: "Unauthorized" });
			}
		},
	};
}

export default fp((app) => {
	app.decorate("firebaseAuth", createPlugin(app));
});
