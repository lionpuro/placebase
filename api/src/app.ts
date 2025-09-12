import Fastify from "fastify";
import autoload from "@fastify/autoload";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

export async function createApp() {
	const app = Fastify({
		logger: true,
	}).withTypeProvider<TypeBoxTypeProvider>();

	await app.register(autoload, {
		dir: path.join(import.meta.dirname, "plugins/external"),
	});
	await app.register(autoload, {
		dir: path.join(import.meta.dirname, "plugins/app"),
	});
	await app.register(autoload, {
		dir: path.join(dirname(fileURLToPath(import.meta.url)), "routes"),
	});

	return app;
}
