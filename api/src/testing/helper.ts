import { type TestContext } from "node:test";
import { createApp } from "../app.js";
import type { FastifyInstance, InjectOptions } from "fastify";
import override from "fastify-override";

declare module "fastify" {
	interface FastifyInstance {
		injectWithAPIKey: typeof injectWithAPIKey;
	}
}

export async function createTestApp(t?: TestContext) {
	const app = await createApp({ logger: false });
	await app.register(override, {
		override: {
			decorators: {
				decorate: {
					apiAuth: {
						verifyAPIKey: async (_key: string) => true,
						createAPIKey: async () => "",
					},
				},
			},
		},
	});
	app.decorate("injectWithAPIKey", injectWithAPIKey);
	return app;
}

async function injectWithAPIKey(this: FastifyInstance, opts: InjectOptions) {
	opts.headers = {
		...opts.headers,
		"x-api-key": "u9bOfRkXsT-AO4hWUnUQDLpyC0IdV23jT0ziFvN1XXE",
	};
	return this.inject({ ...opts });
}
