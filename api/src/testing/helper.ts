import { type TestContext } from "node:test";
import { createApp } from "../app.js";
import type { FastifyInstance, InjectOptions } from "fastify";
import type { APIKeyRepository } from "../modules/apikey/apikey.repository.js";
import type { APIKeyRecord } from "../modules/apikey/apikey.schema.js";
import { randomBytes } from "node:crypto";
import {
	generateAPIKey,
	createHash,
} from "../modules/apikey/apikey.service.js";

declare module "fastify" {
	interface FastifyInstance {
		injectWithAPIKey: ReturnType<typeof injectWithAPIKey>;
	}
}

export async function createTestApp(t?: TestContext) {
	const testKey = generateAPIKey();
	const testHash = createHash(testKey);

	const mockAPIKeyRepository = new MockAPIKeyRepository({
		defaultValues: [{ hash: testHash, user_id: "test-user" }],
	});

	const app = await createApp({
		logger: false,
		modules: {
			apikey: {
				repository: mockAPIKeyRepository,
			},
		},
	});
	app.decorate("injectWithAPIKey", injectWithAPIKey(testKey));
	return app;
}

class MockAPIKeyRepository implements APIKeyRepository {
	private keys: ({ hash: string } & APIKeyRecord)[] = [];

	constructor({
		defaultValues,
	}: {
		defaultValues: { hash: string; user_id: string }[];
	}) {
		this.keys.push(
			...[...defaultValues].map((k) => ({
				id: randomBytes(16).toString("base64url"),
				name: randomBytes(8).toString("base64url"),
				user_id: k.user_id,
				hash: k.hash,
				created_at: new Date().toString(),
			})),
		);
	}

	async byUser(uid: string) {
		const keys = this.keys.filter((k) => k.user_id === uid);
		return keys.map((k) => ({
			id: k.id,
			name: k.name,
			user_id: k.user_id,
			created_at: k.created_at,
		}));
	}
	async byHash(hash: string) {
		const key = this.keys.find((k) => k.hash === hash);
		if (!key) {
			return undefined;
		}
		return {
			id: key.id,
			name: key.name,
			user_id: key.user_id,
			created_at: key.created_at,
		};
	}
	async create(hash: string, name: string, uid: string) {
		const id = randomBytes(16).toString("base64url");
		this.keys.push({
			id,
			name,
			user_id: uid,
			hash,
			created_at: new Date().toString(),
		});
	}
	async delete(id: string, uid: string) {
		this.keys = this.keys.filter((k) => k.id !== id && k.user_id !== uid);
	}
	async deleteByUser(uid: string) {
		this.keys = this.keys.filter((k) => k.user_id !== uid);
	}
}

function injectWithAPIKey(key: string) {
	return function (this: FastifyInstance, opts: InjectOptions) {
		opts.headers = {
			...opts.headers,
			"x-api-key": key,
		};
		return this.inject({ ...opts });
	};
}
