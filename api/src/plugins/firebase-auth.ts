import type { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { firebase } from "../lib/firebase.js";
import { ErrorUnauthorized } from "../lib/errors.js";

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

async function authenticate(request: FastifyRequest, _reply: FastifyReply) {
	const token = request.headers.authorization?.match(/^[Bb]earer (\S+)/)?.[1];
	if (!token) {
		throw new ErrorUnauthorized();
	}
	try {
		const decoded = await firebase.auth().verifyIdToken(token);
		const user: User = {
			id: decoded.uid,
		};
		request.user = user;
	} catch (err) {
		throw new ErrorUnauthorized();
	}
}

export default fp((app) => {
	app.decorate("authenticate", authenticate);
});
