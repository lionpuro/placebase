import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import firebase from "fastify-firebase";
import json from "../../../firebase.json" with { type: "json" };

export default fp(async (fastify: FastifyInstance) => {
	await fastify.register(firebase, json);
});
