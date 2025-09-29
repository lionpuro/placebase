import { after, describe, it } from "node:test";
import { createTestApp } from "../testing/helper.js";
import assert from "node:assert";
import { type State, StateSchema, StatesSchema } from "../schemas/state.js";
import { createValidator } from "../schemas/validation.js";

describe("States endpoints", async () => {
	const app = await createTestApp();
	after(async () => {
		await app.close();
	});

	describe("GET /states", () => {
		const validator = createValidator<State[]>(StatesSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/states",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
		it("should respond with 401", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/states",
			});
			assert.strictEqual(response.statusCode, 401);
		});
	});

	describe("GET /countries/:country_code/states", () => {
		const validator = createValidator<State[]>(StatesSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/states",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
	});

	describe("GET /countries/:country_code/states/:state_code", () => {
		const validator = createValidator<State>(StateSchema, {
			truncateErrors: true,
		});
		it("should respond with 200", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/states/ENG",
			});
			assert.strictEqual(response.statusCode, 200);
			assert.doesNotThrow(() => validator.parse(response.json()));
		});
		it("should respond with 400", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/states/abcdefg",
			});
			assert.strictEqual(response.statusCode, 400);
		});
		it("should respond with 404", async () => {
			const response = await app.injectWithAPIKey({
				method: "GET",
				url: "/countries/GB/states/abcd",
			});
			assert.strictEqual(response.statusCode, 404);
		});
	});
});
