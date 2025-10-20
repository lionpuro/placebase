import fp from "fastify-plugin";
import type { State, StatesQuery } from "./state.schema.js";
import { sqlite, type Database } from "../../lib/database.js";

declare module "fastify" {
	interface FastifyInstance {
		stateRepository: ReturnType<typeof createRepository>;
	}
}

export function createRepository(db: Database) {
	return {
		async find(params: StatesQuery) {
			const stmt: string[] = [];
			const values: string[] = [];
			if (params.iso_code) {
				values.push(`${params.iso_code}`);
				stmt.push(`iso2 LIKE ?`);
			}
			if (params.country) {
				values.push(`${params.country}`);
				stmt.push(`country_code LIKE ?`);
			}
			if (params.name) {
				values.push(`%${params.name}%`);
				stmt.push(`name LIKE ?`);
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
			query += " ORDER BY name";
			if (params.limit) {
				query += ` LIMIT ${params.limit} `;
			}
			if (params.offset) {
				query += ` OFFSET ${params.offset} `;
			}
			const rows = db.prepare(query).all(values) as State[];
			return rows;
		},
	};
}

export default fp((app) => {
	app.decorate("stateRepository", createRepository(sqlite));
});
