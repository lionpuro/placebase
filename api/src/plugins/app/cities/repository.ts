import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { City } from "../../../schemas/index.js";
import type { CitiesParams } from "../../../schemas/request.js";

declare module "fastify" {
	interface FastifyInstance {
		cityRepository: ReturnType<typeof createRepository>;
	}
}

export function createRepository(fastify: FastifyInstance) {
	return {
		async find(params: CitiesParams) {
			const client = await fastify.pg.connect();
			const stmt: string[] = [];
			const values: (string | number)[] = [];
			if (params.name) {
				values.push(`%${params.name}%`);
				stmt.push(`c.name ILIKE $${values.length}`);
			}
			if (params.country) {
				values.push(params.country);
				stmt.push(`c.country_code ILIKE $${values.length}`);
			}
			if (params.state) {
				values.push(params.state);
				stmt.push(`c.state_code = $${values.length}`);
			}
			if (params.min_lat) {
				values.push(params.min_lat);
				stmt.push(`c.latitude >= $${values.length}`);
			}
			if (params.max_lat) {
				values.push(params.max_lat);
				stmt.push(`c.latitude <= $${values.length}`);
			}
			if (params.min_lon) {
				values.push(params.min_lon);
				stmt.push(`c.longitude >= $${values.length}`);
			}
			if (params.max_lon) {
				values.push(params.max_lon);
				stmt.push(`c.longitude <= $${values.length}`);
			}
			let query = `
			SELECT
				c.id,
				c.name,
				c.state_code AS state,
				c.country_code AS country,
				c.latitude,
				c.longitude,
				COALESCE(c.timezone, s.timezone) AS timezone
			FROM cities c
			INNER JOIN states s
				ON c.state_id = s.id`;
			if (stmt.length > 0) {
				query += ` WHERE ${stmt.join(" AND ")}`;
			}
			query += " ORDER BY name";
			if (params.limit) {
				query += ` LIMIT ${params.limit} `;
			}
			if (params.offset) {
				query += ` OFFSET ${params.offset} `;
			}
			try {
				const { rows }: { rows: City[] } = await client.query(query, values);
				return rows;
			} finally {
				client.release();
			}
		},
	};
}

export default fp((fastify) => {
	fastify.decorate("cityRepository", createRepository(fastify));
});
