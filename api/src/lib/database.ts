import SQLite, { type Database as SQLiteDatabase } from "better-sqlite3";
import { join } from "node:path";

export type Database = SQLiteDatabase;

export function open(filename: string): Database {
	const db = new SQLite(filename, {
		readonly: true,
		fileMustExist: true,
	});
	return db;
}

export const sqlite: Database = open(
	join(import.meta.dirname, "../../data/v3.0/world.sqlite3"),
);
