import { after, describe, it } from "node:test";
import { createTestApp } from "../testing/helper.js";
import assert from "node:assert";
import { CountriesSchema, Country, CountrySchema } from "../schemas/country.js";
import { createValidator } from "../schemas/validation.js";

describe("Countries endpoints", async () => {
	const app = await createTestApp();
	after(async () => {
		await app.close();
	});

	describe("GET /countries", () => {
		const validator = createValidator<Country[]>(CountriesSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
		it("should respond with 401", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/countries",
			});
			assert.strictEqual(response.statusCode, 401);
		});
	});

	describe("GET /countries/:iso_code", () => {
		const validator = createValidator<Country>(CountrySchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
		it("should respond with 404", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/ZZ",
			});
			assert.strictEqual(response.statusCode, 404);
		});
		it("should respond with 400", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/ABCDEFG",
			});
			assert.strictEqual(response.statusCode, 400);
		});
	});
});
