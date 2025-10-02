import fp from "fastify-plugin";
import SQLite, { type Database } from "better-sqlite3";

declare module "fastify" {
	export interface FastifyInstance {
		sqlite: Database;
	}
}

function connect(filename: string) {
	const db = new SQLite(filename, {
		readonly: true,
		fileMustExist: true,
	});
	return db;
}

export default fp((app) => {
	app.decorate("sqlite", connect("./data/v3.0/world.sqlite3"));
});
