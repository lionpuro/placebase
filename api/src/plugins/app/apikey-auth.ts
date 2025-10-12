import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import crypto from "node:crypto";

declare module "fastify" {
	export interface FastifyInstance {
		apikeyAuth: APIKeyAuth;
	}
}

export type APIKeyAuth = {
	verifyAPIKey: (key: string) => Promise<boolean>;
	createAPIKey: (uid: string, name: string) => Promise<string>;
};

export function generateAPIKey(): string {
	const raw = crypto.randomBytes(32).toString("base64url");
	return raw;
}

export function createHash(input: string): string {
	const hash = crypto.createHash("sha256").update(input).digest("hex");
	return hash;
}

export function createPlugin(app: FastifyInstance): APIKeyAuth {
	return {
		async verifyAPIKey(key: string) {
			const hash = createHash(key);
			const result = await app.keyRepository.byHash(hash);
			return result !== undefined;
		},
		async createAPIKey(uid: string, name: string) {
			const raw = generateAPIKey();
			const hash = createHash(raw);
			await app.keyRepository.create(hash, name, uid);
			return raw;
		},
	};
}

export default fp((app) => {
	app.decorate("apikeyAuth", createPlugin(app));
});
