import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { QueryResult } from "../../types.js";

declare module "fastify" {
	interface FastifyInstance {
		userRepository: ReturnType<typeof createRepository>;
	}
}

export function createRepository(fastify: FastifyInstance) {
	return {
		async create(uid: string) {
			const client = await fastify.pg.connect();
			try {
				const query = `INSERT INTO users (id) VALUES ($1)`;
				await client.query(query, [uid]);
			} finally {
				client.release();
			}
		},
		async delete(uid: string) {
			const client = await fastify.pg.connect();
			try {
				const query = `DELETE FROM users WHERE id = $1`;
				const { rowCount }: QueryResult = await client.query(query, [uid]);
				return rowCount;
			} finally {
				client.release();
			}
		},
	};
}

export default fp((fastify) => {
	fastify.decorate("userRepository", createRepository(fastify));
});
