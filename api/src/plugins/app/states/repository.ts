import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { State } from "../../../schemas/index.js";
import type { StatesParams } from "../../../schemas/request.js";

declare module "fastify" {
	interface FastifyInstance {
		stateRepository: ReturnType<typeof createRepository>;
	}
}

export function createRepository(fastify: FastifyInstance) {
	return {
		async find(params: StatesParams) {
			const client = await fastify.pg.connect();
			const stmt: string[] = [];
			const values: string[] = [];
			if (params.iso_code) {
				values.push(`${params.iso_code}`);
				stmt.push(`iso2 ILIKE $${values.length}`);
			}
			if (params.country) {
				values.push(`${params.country}`);
				stmt.push(`country_code ILIKE $${values.length}`);
			}
			if (params.name) {
				values.push(`%${params.name}%`);
				stmt.push(`name ILIKE $${values.length}`);
			}
			let query = `
			SELECT
				name,
				iso2,
				type,
				country_code AS country,
				latitude,
				longitude,
				timezone
			FROM states`;
			if (stmt.length > 0) {
				query += ` WHERE ${stmt.join(" AND ")}`;
			}
			if (params.limit) {
				query += ` LIMIT ${params.limit} `;
			}
			if (params.offset) {
				query += ` OFFSET ${params.offset} `;
			}
			try {
				const { rows }: { rows: State[] } = await client.query(query, values);
				return rows;
			} finally {
				client.release();
			}
		},
	};
}

export default fp((fastify) => {
	fastify.decorate("stateRepository", createRepository(fastify));
});
