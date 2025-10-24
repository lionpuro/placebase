import fp from "fastify-plugin";
import type { Country, CountriesQuery } from "./country.schema.js";
import { sqlite, type Database } from "../../lib/database.js";

declare module "fastify" {
	interface FastifyInstance {
		countryRepository: ReturnType<typeof createRepository>;
	}
}

type CountryFilters = CountriesQuery & { iso_code?: string };

export function createRepository(db: Database) {
	return {
		async find(params: CountryFilters) {
			const stmt: string[] = [];
			const values: string[] = [];
			if (params.iso_code) {
				values.push(`${params.iso_code}`);
				stmt.push(`iso2 LIKE ?`);
			}
			if (params.name) {
				values.push(`%${params.name}%`);
				stmt.push(`name LIKE ?`);
			}
			if (params.continent) {
				values.push(params.continent);
				stmt.push(`region LIKE ?`);
			}
			if (params.currency) {
				values.push(params.currency);
				stmt.push(`currency LIKE ?`);
			}
			if (params.phonecode) {
				values.push(params.phonecode);
				stmt.push(`phonecode = ?`);
			}
			let query = `
			SELECT
				name,
				iso2,
				phonecode,
				capital,
				currency,
				native,
				region AS continent,
				emoji
			FROM countries`;
			if (stmt.length > 0) {
				query += ` WHERE ${stmt.join(" AND ")}`;
			}
			query += " ORDER BY name";
			if (params.limit) {
				query += ` LIMIT ${params.limit} `;
			}
			if (params.offset) {
				if (!params.limit) {
					query += ` LIMIT -1 `;
				}
				query += ` OFFSET ${params.offset} `;
			}
			const rows = db.prepare(query).all(values) as Country[];
			return rows;
		},
	};
}

export default fp((app) => {
	app.decorate("countryRepository", createRepository(sqlite));
});
