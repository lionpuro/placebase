import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import crypto from "node:crypto";

declare module "fastify" {
	export interface FastifyInstance {
		apikeyService: APIKeyService;
	}
}

export type APIKeyService = ReturnType<typeof createAPIKeyService>;

export function generateAPIKey(): string {
	const raw = crypto.randomBytes(32).toString("base64url");
	return raw;
}

export function createHash(input: string): string {
	const hash = crypto.createHash("sha256").update(input).digest("hex");
	return hash;
}

export function createAPIKeyService(app: FastifyInstance) {
	return {
		async verify(key: string) {
			const hash = createHash(key);
			const result = await app.apikeyRepository.byHash(hash);
			return result !== undefined;
		},
		async create(uid: string, name: string) {
			const raw = generateAPIKey();
			const hash = createHash(raw);
			await app.apikeyRepository.create(hash, name, uid);
			return raw;
		},
		async byUser(uid: string) {
			return app.apikeyRepository.byUser(uid);
		},
		async delete(id: string, uid: string) {
			return app.apikeyRepository.delete(id, uid);
		},
		async deleteByUser(uid: string) {
			return app.apikeyRepository.deleteByUser(uid);
		},
	};
}

function plugin(app: FastifyInstance) {
	app.decorate("apikeyService", createAPIKeyService(app));
}

export default fp(plugin, {
	name: "apikey-service",
	dependencies: ["apikey-repository"],
});
