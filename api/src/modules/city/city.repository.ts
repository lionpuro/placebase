import fp from "fastify-plugin";
import type { City, CitiesQuery } from "./city.schema.js";
import { sqlite, type Database } from "../../lib/database.js";

declare module "fastify" {
	interface FastifyInstance {
		cityRepository: ReturnType<typeof createRepository>;
	}
}

export function createRepository(db: Database) {
	return {
		async find(params: CitiesQuery) {
			const stmt: string[] = [];
			const values: (string | number)[] = [];
			if (params.name) {
				values.push(`%${params.name}%`);
				stmt.push(`c.name LIKE ?`);
			}
			if (params.country) {
				values.push(params.country);
				stmt.push(`c.country_code LIKE ?`);
			}
			if (params.state) {
				values.push(params.state);
				stmt.push(`c.state_code = ?`);
			}
			if (params.min_lat) {
				values.push(params.min_lat);
				stmt.push(`c.latitude >= ?`);
			}
			if (params.max_lat) {
				values.push(params.max_lat);
				stmt.push(`c.latitude <= ?`);
			}
			if (params.min_lon) {
				values.push(params.min_lon);
				stmt.push(`c.longitude >= ?`);
			}
			if (params.max_lon) {
				values.push(params.max_lon);
				stmt.push(`c.longitude <= ?`);
			}
			let query = `
			SELECT
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
			query += " ORDER BY c.name";
			if (params.limit) {
				query += ` LIMIT ${params.limit} `;
			}
			if (params.offset) {
				query += ` OFFSET ${params.offset} `;
			}
			const rows = db.prepare(query).all(values) as City[];
			return rows;
		},
	};
}

export default fp((app) => {
	app.decorate("cityRepository", createRepository(sqlite));
});
