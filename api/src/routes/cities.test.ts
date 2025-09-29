import { after, describe, it } from "node:test";
import { createTestApp } from "../testing/helper.js";
import assert from "node:assert";
import { type City, CitiesSchema } from "../schemas/city.js";
import { createValidator } from "../schemas/validation.js";

describe("Cities endpoints", async () => {
	const app = await createTestApp();
	after(async () => {
		await app.close();
	});

	describe("GET /cities", () => {
		const validator = createValidator<City[]>(CitiesSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/cities",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
		it("should respond with 401", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/cities",
			});
			assert.strictEqual(response.statusCode, 401);
		});
	});

	describe("GET /countries/:country_code/states/:state_code/cities", () => {
		const validator = createValidator<City[]>(CitiesSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/states/ENG/cities",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
		it("should respond with 400", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/states/abcdefg/cities",
			});
			assert.strictEqual(response.statusCode, 400);
		});
	});
});
