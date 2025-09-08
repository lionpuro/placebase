import { type FastifyInstance } from "fastify";
import postgres from "@fastify/postgres";
import fp from "fastify-plugin";

const config = () => {
	const {
		POSTGRES_USER,
		POSTGRES_PASSWORD,
		POSTGRES_HOST,
		POSTGRES_PORT,
		POSTGRES_DB,
	} = process.env;
	return {
		connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable`,
	};
};

export default fp(async (fastify: FastifyInstance, opts) => {
	fastify.register(postgres, config());
});
