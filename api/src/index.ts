import { createApp } from "./app.js";

(async () => {
	const app = await createApp();
	await app.ready();

	const isGCR = process.env.K_SERVICE !== undefined;
	const host = isGCR ? "0.0.0.0" : "localhost";

	try {
		await app.listen({
			port: Number(process.env.PORT ?? 3000),
			host: host,
		});
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
})();
