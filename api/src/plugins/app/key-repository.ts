import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { QueryResult } from "../../types.js";
import type { APIKeyRecord } from "../../schemas/index.js";

declare module "fastify" {
	export interface FastifyInstance {
		keyRepository: KeyRepository;
	}
}

export type KeyRepository = ReturnType<typeof createRepository>;

export function createRepository(fastify: FastifyInstance) {
	return {
		async byUser(uid: string) {
			const client = await fastify.pg.connect();
			try {
				const query = `
				SELECT id, user_id, created_at
				FROM api_keys
				WHERE user_id = $1`;
				const { rows }: QueryResult<APIKeyRecord> = await client.query(query, [
					uid,
				]);
				return rows;
			} finally {
				client.release();
			}
		},
		async byHash(hash: string) {
			const client = await fastify.pg.connect();
			try {
				const query = `
				SELECT id, user_id, created_at
				FROM api_keys
				WHERE hash = $1`;
				const {
					rows: [key],
				}: QueryResult<APIKeyRecord> = await client.query(query, [hash]);
				return key;
			} finally {
				client.release();
			}
		},
		async create(hash: string, uid: string) {
			const client = await fastify.pg.connect();
			try {
				const query = `
				INSERT INTO api_keys (hash, user_id)
				VALUES ($1, $2)`;
				await client.query(query, [hash, uid]);
			} finally {
				client.release();
			}
		},
		async delete(id: string, uid: string) {
			const client = await fastify.pg.connect();
			try {
				const query = `
				DELETE FROM api_keys
				WHERE id = $1 AND user_id = $2`;
				await client.query(query, [id, uid]);
			} finally {
				client.release();
			}
		},
	};
}

export default fp((fastify) => {
	fastify.decorate("keyRepository", createRepository(fastify));
});
