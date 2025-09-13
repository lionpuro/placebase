import { after, before, describe, it } from "node:test";
import { createApp } from "../app.js";
import type { FastifyInstance } from "fastify";
import assert from "node:assert";

describe("Countries endpoints", () => {
	let app: FastifyInstance;
	before(async () => {
		app = await createApp({ logger: false });
	});
	after(async () => {
		await app.close();
	});

	describe("GET /countries", () => {
		it("should respond with 200", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/countries",
			});
			assert.strictEqual(response.statusCode, 200);
		});
	});

	describe("GET /countries/:iso_code", () => {
		it("should respond with 200", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/countries/GB",
			});
			assert.strictEqual(response.statusCode, 200);
		});
		it("should respond with 404", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/countries/ZZ",
			});
			assert.strictEqual(response.statusCode, 404);
		});
		it("should respond with 400", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/countries/ABCDEFG",
			});
			assert.strictEqual(response.statusCode, 400);
		});
	});
});
