import { after, before, describe, it } from "node:test";
import { createApp } from "../../src/app.js";
import type { FastifyInstance } from "fastify";
import assert from "node:assert";

describe("Cities endpoints", () => {
	let app: FastifyInstance;
	before(async () => {
		app = await createApp({ logger: false });
	});
	after(async () => {
		await app.close();
	});

	describe("GET /cities", () => {
		it("should respond with 200", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/states",
			});
			assert.strictEqual(response.statusCode, 200);
		});
	});

	describe("GET /countries/:country_code/states/:state_code/cities", () => {
		it("should respond with 200", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/countries/GB/states/ENG/cities",
			});
			assert.strictEqual(response.statusCode, 200);
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
