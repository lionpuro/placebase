import SQLite, { type Database as SQLiteDatabase } from "better-sqlite3";

export type Database = SQLiteDatabase;

export function open(filename: string): Database {
	const db = new SQLite(filename, {
		readonly: true,
		fileMustExist: true,
	});
	return db;
}

export const sqlite: Database = open("./data/v3.0/world.sqlite3");
