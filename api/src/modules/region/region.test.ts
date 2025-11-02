import { after, describe, it } from "node:test";
import { createTestApp, createValidator } from "../../testing/helper.js";
import assert from "node:assert";
import { type Region, RegionSchema, RegionsSchema } from "./region.schema.js";

describe("Regions endpoints", async () => {
	const app = await createTestApp();
	after(async () => {
		await app.close();
	});

	describe("GET /regions", () => {
		const validator = createValidator<Region[]>(RegionsSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/regions",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
		it("should respond with 401", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/regions",
			});
			assert.strictEqual(response.statusCode, 401);
		});
	});

	describe("GET /countries/:country_code/regions", () => {
		const validator = createValidator<Region[]>(RegionsSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/regions",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
	});

	describe("GET /countries/:country_code/regions/:region_code", () => {
		const validator = createValidator<Region>(RegionSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/regions/ENG",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
		it("should respond with 400", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/regions/abcdefg",
			});
			assert.strictEqual(response.statusCode, 400);
		});
		it("should respond with 404", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/regions/abcd",
			});
			assert.strictEqual(response.statusCode, 404);
		});
	});
});
