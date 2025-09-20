import type { QueryResultRow, Result } from "pg";

export type QueryResult<T extends QueryResultRow = any> = Result<T>;
