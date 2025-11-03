import { createApp } from "../src/app.js";
import type { FastifyInstance, InjectOptions } from "fastify";
import type { APIKeyRepository } from "../src/modules/apikey/apikey.repository.js";
import type { APIKeyRecord } from "../src/modules/apikey/apikey.schema.js";
import {
	generateAPIKey,
	createHash,
} from "../src/modules/apikey/apikey.service.js";
import { randomBytes } from "node:crypto";
import type { TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

declare module "fastify" {
	interface FastifyInstance {
		injectWithAPIKey: ReturnType<typeof injectWithAPIKey>;
	}
}
export async function createTestApp() {
	const testKey = generateAPIKey();
	const testHash = createHash(testKey);

	const mockAPIKeyRepository = new MockAPIKeyRepository({
		defaultValues: [{ hash: testHash, user_id: randomString(21) }],
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
				id: randomString(16),
				name: randomString(8),
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
		const id = randomString(16);
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

function randomString(bytes: number) {
	return randomBytes(bytes).toString("base64url");
}

interface SchemaValidator<T> {
	schema: TSchema;
	parse: (data: T) => T;
}

type ValidatorOptions = {
	truncateErrors?: boolean;
};

export function createValidator<T extends unknown>(
	schema: TSchema,
	opts?: ValidatorOptions,
): SchemaValidator<T> {
	const C = TypeCompiler.Compile(schema);
	const parse = (data: T): T => {
		const isValid = C.Check(data);
		if (isValid) {
			return data;
		}
		const errs = [...C.Errors(data)];
		const content = JSON.stringify(
			errs
				.slice(0, !opts?.truncateErrors || errs.length < 6 ? undefined : 5)
				.map(({ path, message }) => ({ path, message })),
		);
		throw new Error(
			opts?.truncateErrors && errs.length > 5
				? `${content} and ${errs.length - 5} more errors`
				: content,
		);
	};
	return { schema, parse };
}
