import { Type, type Static } from "@sinclair/typebox";

const defaultParams = {
	limit: Type.Optional(Type.Number({ minimum: 1 })),
	offset: Type.Optional(Type.Number()),
};

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
	...defaultParams,
});

export type CountriesParams = Static<typeof CountriesQuerySchema>;

export const StateCodeSchema = Type.String({
	description: "ISO2 code of state",
	minLength: 1,
	maxLength: 5,
});

export const CountryStatesQuerySchema = Type.Object(defaultParams);

export const StatesQuerySchema = Type.Object({
	name: Type.Optional(Type.String()),
	iso_code: Type.Optional(StateCodeSchema),
	country: Type.Optional(CountryCodeSchema),
	...defaultParams,
});

export type StatesParams = Static<typeof StatesQuerySchema>;
