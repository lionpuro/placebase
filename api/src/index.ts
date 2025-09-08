import Fastify from "fastify";
import Autoload from "@fastify/autoload";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

declare module "fastify" {
	interface FastifyRequest {}
}

const server = Fastify({
	logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

await server.register(Autoload, {
	dir: path.join(import.meta.dirname, "plugins/external"),
});
await server.register(Autoload, {
	dir: path.join(dirname(fileURLToPath(import.meta.url)), "routes"),
});

async function start() {
	try {
		await server.listen({ port: Number(process.env.PORT ?? 3000) });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}
start();
