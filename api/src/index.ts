import { createApp } from "./app.js";

declare module "fastify" {
	interface FastifyRequest {}
}

async function start() {
	const app = await createApp();
	await app.ready();
	app.swagger();
	try {
		await app.listen({ port: Number(process.env.PORT ?? 3000) });
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}
start();
