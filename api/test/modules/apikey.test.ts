import { describe, it } from "node:test";
import assert from "node:assert";
import { createTestUser, injectWithFirebaseToken } from "../helper.js";
import { createApp } from "../../src/app.js";

describe("API Key endpoints", async () => {
	const app = await createApp({ logger: false });
	const user = await createTestUser();
	// save a test key
	await app.apikeyService.create(user.localId, "key-1");
	const [apikey] = await app.apikeyService.byUser(user.localId);
	if (!apikey) {
		throw new Error("failed to initialize tests");
	}

	describe("GET /internal/api-keys", () => {
		it("should respond with 200", async () => {
			const response = await injectWithFirebaseToken(
				app,
				{
					method: "GET",
					url: "/internal/api-keys",
				},
				user.idToken,
			);
			assert.strictEqual(response.statusCode, 200);
		});
		it("should respond with 401", async () => {
			const response = await injectWithFirebaseToken(
				app,
				{
					method: "GET",
					url: "/internal/api-keys",
				},
				"invalid-token",
			);
			assert.strictEqual(response.statusCode, 401);
		});
	});

	describe("POST /internal/api-keys", () => {
		it("should respond with 200", async () => {
			const response = await injectWithFirebaseToken(
				app,
				{
					method: "POST",
					url: "/internal/api-keys",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ name: "test-key" }),
				},
				user.idToken,
			);
			assert.strictEqual(response.statusCode, 200);
		});
		it("should respond with 401", async () => {
			const response = await injectWithFirebaseToken(
				app,
				{
					method: "POST",
					url: "/internal/api-keys",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ name: "test-key" }),
				},
				"invalid-token",
			);
			assert.strictEqual(response.statusCode, 401);
		});
	});

	describe("DELETE /internal/api-keys/:id", () => {
		it("should respond with 204", async () => {
			const response = await injectWithFirebaseToken(
				app,
				{
					method: "DELETE",
					url: "/internal/api-keys/" + apikey.id,
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ name: "test-key" }),
				},
				user.idToken,
			);
			assert.strictEqual(response.statusCode, 204);
		});
		it("should respond with 404", async () => {
			const response = await injectWithFirebaseToken(
				app,
				{
					method: "DELETE",
					url: "/internal/api-keys/invalid-id",
				},
				user.idToken,
			);
			assert.strictEqual(response.statusCode, 404);
		});
		it("should respond with 401", async () => {
			const response = await injectWithFirebaseToken(
				app,
				{
					method: "DELETE",
					url: "/internal/api-keys/anything",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ name: "test-key" }),
				},
				"invalid-token",
			);
			assert.strictEqual(response.statusCode, 401);
		});
	});
});
