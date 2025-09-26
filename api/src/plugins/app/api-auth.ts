import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import crypto from "node:crypto";

declare module "fastify" {
	export interface FastifyInstance {
		apiAuth: APIAuth;
	}
}

export type APIAuth = {
	verifyAPIKey: (key: string) => Promise<boolean>;
	createAPIKey: (uid: string) => Promise<string>;
};

export function generateAPIKey(): string {
	const raw = crypto.randomBytes(32).toString("base64url");
	return raw;
}

export function createHash(input: string): string {
	const hash = crypto.createHash("sha256").update(input).digest("hex");
	return hash;
}

export function createPlugin(app: FastifyInstance): APIAuth {
	return {
		async verifyAPIKey(key: string) {
			const hash = createHash(key);
			const result = await app.keyRepository.byHash(hash);
			return result !== undefined;
		},
		async createAPIKey(uid: string) {
			const raw = generateAPIKey();
			const hash = createHash(raw);
			await app.keyRepository.create(hash, uid);
			return raw;
		},
	};
}

export default fp((app) => {
	app.decorate("apiAuth", createPlugin(app));
	app.addHook("onRequest", async (request, reply) => {
		if (
			!request.url.startsWith("/internal") &&
			!request.url.endsWith("openapi.json")
		) {
			const header = request.headers["x-api-key"];
			if (!header) {
				return reply.code(401).send({ message: "Missing API key" });
			}
			const key = typeof header === "string" ? header : header[0];
			if (!key) {
				return reply.code(401).send({ message: "Missing API key" });
			}
			try {
				const valid = await app.apiAuth.verifyAPIKey(key);
				if (!valid) {
					return reply.code(401).send({ message: "Invalid API key" });
				}
			} catch (err) {
				app.log.error(err);
				return reply.code(500).send({ message: "Failed to verify API key" });
			}
		}
	});
});
