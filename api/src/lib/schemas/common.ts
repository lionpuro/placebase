import { Type, type TSchema } from "@sinclair/typebox";

export const AuthHeaders = Type.Object({
	Authorization: Type.String({
		description: "Firebase auth ID token",
		examples: ["Bearer <token>"],
	}),
});

export const ErrorResponseSchema = Type.Object({ message: Type.String() });

export const paginationParams = {
	limit: Type.Optional(Type.Number({ minimum: 1 })),
	offset: Type.Optional(Type.Number()),
};

export const Nullable = <T extends TSchema>(schema: T) => {
	return Type.Union([schema, Type.Null()]);
};

export const CountryCodeSchema = Type.String({
	description: "ISO-3166 alpha-2 country code",
	examples: ["FI"],
	minLength: 2,
	maxLength: 2,
});

export const StateCodeSchema = Type.String({
	description: "ISO2 code of state",
	examples: ["11"],
	minLength: 1,
	maxLength: 5,
});

export const Latitude = Type.Number({ minimum: -90, maximum: 90 });
export const Longitude = Type.Number({ minimum: -180, maximum: 180 });
