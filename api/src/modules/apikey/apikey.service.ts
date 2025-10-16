import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import crypto from "node:crypto";
import type { APIKeyRepository } from "./apikey.repository.js";

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

export function createAPIKeyService(repository: APIKeyRepository) {
	return {
		async verify(key: string) {
			const hash = createHash(key);
			const result = await repository.byHash(hash);
			return result !== undefined;
		},
		async create(uid: string, name: string) {
			const raw = generateAPIKey();
			const hash = createHash(raw);
			await repository.create(hash, name, uid);
			return raw;
		},
		async byUser(uid: string) {
			return repository.byUser(uid);
		},
		async delete(id: string, uid: string) {
			return repository.delete(id, uid);
		},
		async deleteByUser(uid: string) {
			return repository.deleteByUser(uid);
		},
	};
}

interface APIKeyServiceOptions extends FastifyPluginOptions {
	repository: APIKeyRepository;
}

function plugin(app: FastifyInstance, opts: APIKeyServiceOptions) {
	app.decorate("apikeyService", createAPIKeyService(opts.repository));
}

export default fp(plugin, {
	name: "apikey-service",
});
