import Fastify from "fastify";
import autoload from "@fastify/autoload";
import path from "node:path";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const defaultOptions = {
	logger: true,
};

export async function createApp(opts: Partial<typeof defaultOptions> = {}) {
	const app = Fastify({
		...defaultOptions,
		...opts,
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
