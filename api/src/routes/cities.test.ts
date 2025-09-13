import { after, before, describe, it } from "node:test";
import { createApp } from "../app.js";
import type { FastifyInstance } from "fastify";
import assert from "node:assert";
import { type City, CitiesSchema } from "../schemas/index.js";
import { createValidator } from "../schemas/validation.js";

describe("Cities endpoints", () => {
	let app: FastifyInstance;
	before(async () => {
		app = await createApp({ logger: false });
	});
	after(async () => {
		await app.close();
	});

	describe("GET /cities", () => {
		const validator = createValidator<City[]>(CitiesSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/cities",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
	});

	describe("GET /countries/:country_code/states/:state_code/cities", () => {
		const validator = createValidator<City[]>(CitiesSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/countries/GB/states/ENG/cities",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
		it("should respond with 400", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/countries/GB/states/abcdefg/cities",
			});
			assert.strictEqual(response.statusCode, 400);
		});
	});
});
