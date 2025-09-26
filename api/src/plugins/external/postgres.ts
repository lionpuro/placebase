import { type FastifyInstance } from "fastify";
import PG from "pg";
import postgres from "@fastify/postgres";
import fp from "fastify-plugin";

// timestamp without time zone
PG.types.setTypeParser(1114, function (str) {
	return new Date(str + "+0000");
});

const config = () => {
	const {
		POSTGRES_USER,
		POSTGRES_PASSWORD,
		POSTGRES_HOST,
		POSTGRES_PORT,
		POSTGRES_DB,
	} = process.env;
	return {
		pg: PG,
		connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable`,
	};
};

export default fp(async (app: FastifyInstance, opts) => {
	await app.register(postgres, config());
});
