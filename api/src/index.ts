import { createApp, registerPlugins } from "./app.js";

(async () => {
	const app = createApp();
	await registerPlugins(app);
	await app.ready();
	app.swagger();
	try {
		await app.listen({ port: Number(process.env.PORT ?? 3000) });
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
})();
