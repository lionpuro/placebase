import type { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { firebase } from "../lib/firebase.js";

declare module "fastify" {
	interface FastifyInstance {
		authenticate: Middleware;
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

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
	const token = request.headers.authorization?.match(/^[Bb]earer (\S+)/)?.[1];
	if (!token) {
		return reply.code(401).send({ message: "Unauthorized" });
	}
	try {
		const decoded = await firebase.auth().verifyIdToken(token);
		if (!decoded.uid || !decoded.email) {
			return reply.code(401).send({ message: "Unauthorized" });
		}
		const user: User = {
			id: decoded.uid,
		};
		request.user = user;
	} catch (err) {
		return reply.code(401).send({ message: "Unauthorized" });
	}
}

export default fp((app) => {
	app.decorate("authenticate", authenticate);
});
