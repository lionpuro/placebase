import type { TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

interface Validator<T> {
	schema: TSchema;
	parse: (data: T) => T;
}

type ValidatorOptions = {
	truncateErrors?: boolean;
};

export function createValidator<T extends unknown>(
	schema: TSchema,
	opts?: ValidatorOptions,
): Validator<T> {
	const C = TypeCompiler.Compile(schema);
	const parse = (data: T): T => {
		const isValid = C.Check(data);
		if (isValid) {
			return data;
		}
		const errs = [...C.Errors(data)];
		const content = JSON.stringify(
			errs
				.slice(0, !opts?.truncateErrors || errs.length < 6 ? undefined : 5)
				.map(({ path, message }) => ({ path, message })),
		);
		throw new Error(
			opts?.truncateErrors && errs.length > 5
				? `${content} and ${errs.length - 5} more errors`
				: content,
		);
	};
	return { schema, parse };
}
