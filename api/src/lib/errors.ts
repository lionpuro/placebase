import type { FastifySchemaValidationError } from "fastify";

export class HTTPError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super();
		this.status = status;
		this.message = message;
	}
}

export class ErrorBadRequest extends HTTPError {
	constructor(message: string = "Bad Request") {
		super(400, message);
	}
}

export class ErrorNotFound extends HTTPError {
	constructor(message: string = "Not Found") {
		super(404, message);
	}
}

export class ErrorUnauthorized extends HTTPError {
	constructor(message: string = "Unauthorized") {
		super(401, message);
	}
}

export class ErrorForbidden extends HTTPError {
	constructor(message: string = "Forbidden") {
		super(403, message);
	}
}

export function schemaErrorFormatter(errors: FastifySchemaValidationError[]) {
	if (errors.length === 0) {
		return new Error("validation failed: no errors found");
	}

	const first = errors[0];
	const instancePath = first?.instancePath.substring(1) ?? "";
	const message = first?.message ?? "";
	const error = `${instancePath}${instancePath ? ": " : ""}${message}`;

	return new ErrorBadRequest(error);
}
