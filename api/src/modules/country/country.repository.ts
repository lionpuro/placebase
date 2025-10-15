import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { Country, CountriesQuery } from "./country.schema.js";

declare module "fastify" {
	interface FastifyInstance {
		countryRepository: ReturnType<typeof createRepository>;
	}
}

type CountryFilters = CountriesQuery & { iso_code?: string };

export function createRepository(app: FastifyInstance) {
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
			if (params.region) {
				values.push(params.region);
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
				region,
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
			const rows = app.sqlite.prepare(query).all(values) as Country[];
			return rows;
		},
	};
}

export default fp((app) => {
	app.decorate("countryRepository", createRepository(app));
});
