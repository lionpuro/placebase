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
	phonecode: Type.Optional(Type.String({ examples: ["358"] })),
	...defaultParams,
});

export type CountriesParams = Static<typeof CountriesQuerySchema>;

export const StateCodeSchema = Type.String({
	description: "ISO2 code of state",
	examples: ["11"],
	minLength: 1,
	maxLength: 5,
});

export const CountryStatesQuerySchema = Type.Object(defaultParams);

export const StatesQuerySchema = Type.Object({
	name: Type.Optional(Type.String()),
	iso_code: Type.Optional(StateCodeSchema),
	country: Type.Optional(CountryCodeSchema),
	limit: Type.Optional(Type.Number({ minimum: 1, maximum: 250, default: 250 })),
	offset: Type.Optional(Type.Number()),
});

export type StatesParams = Static<typeof StatesQuerySchema>;

export const CountryStateCitiesQuerySchema = Type.Object(defaultParams);

const Latitude = Type.Number({ minimum: -90, maximum: 90 });
const Longitude = Type.Number({ minimum: -180, maximum: 180 });

export const CitiesQuerySchema = Type.Object({
	name: Type.Optional(Type.String()),
	country: Type.Optional(CountryCodeSchema),
	state: Type.Optional(StateCodeSchema),
	min_lat: Type.Optional(Latitude),
	max_lat: Type.Optional(Latitude),
	min_lon: Type.Optional(Longitude),
	max_lon: Type.Optional(Longitude),
	limit: Type.Optional(Type.Number({ minimum: 1, maximum: 250, default: 250 })),
	offset: Type.Optional(Type.Number()),
});

export type CitiesParams = Static<typeof CitiesQuerySchema>;
