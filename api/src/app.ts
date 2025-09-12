import Fastify from "fastify";
import autoload from "@fastify/autoload";
import path from "node:path";
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
		dir: path.join(import.meta.dirname, "routes"),
	});

	return app;
}
