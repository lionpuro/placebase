import { Type, type Static } from "@sinclair/typebox";

export const CountryCodeSchema = Type.String({
	description: "ISO-3166 alpha-2 country code",
	examples: ["FI"],
	minLength: 2,
	maxLength: 2,
});

export const CountriesQuerySchema = Type.Object({
	name: Type.Optional(Type.String()),
	currency: Type.Optional(Type.String({ minLength: 3, maxLength: 3 })),
	region: Type.Optional(Type.String()),
	limit: Type.Optional(Type.Number()),
	offset: Type.Optional(Type.Number()),
});

export type CountriesParams = Static<typeof CountriesQuerySchema>;
