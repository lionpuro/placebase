import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import type { Country } from "../../schemas/index.js";
import type { CountriesQuery } from "../../schemas/request.js";

declare module "fastify" {
	interface FastifyInstance {
		countryRepository: ReturnType<typeof createRepository>;
	}
}

type CountryFilters = CountriesQuery & { iso_code?: string };

export function createRepository(fastify: FastifyInstance) {
	return {
		async find(params: CountryFilters) {
			const client = await fastify.pg.connect();
			const stmt: string[] = [];
			const values: string[] = [];
			if (params.iso_code) {
				values.push(`${params.iso_code}`);
				stmt.push(`iso2 ILIKE $${values.length}`);
			}
			if (params.name) {
				values.push(`%${params.name}%`);
				stmt.push(`name ILIKE $${values.length}`);
			}
			if (params.region) {
				values.push(params.region);
				stmt.push(`region = $${values.length}`);
			}
			if (params.currency) {
				values.push(params.currency);
				stmt.push(`currency = $${values.length}`);
			}
			if (params.phonecode) {
				values.push(params.phonecode);
				stmt.push(`phonecode = $${values.length}`);
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
				query += ` OFFSET ${params.offset} `;
			}
			try {
				const { rows }: { rows: Country[] } = await client.query(query, values);
				return rows;
			} finally {
				client.release();
			}
		},
	};
}

export default fp((fastify) => {
	fastify.decorate("countryRepository", createRepository(fastify));
});
