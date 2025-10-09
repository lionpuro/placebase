import { type Static, Type } from "@sinclair/typebox";
import {
	CountryCodeSchema,
	Latitude,
	Longitude,
	paginationParams,
	StateCodeSchema,
} from "./common.js";

export const CitySchema = Type.Object({
	id: Type.Number({ examples: [153335] }),
	name: Type.String({ examples: ["Tampere"] }),
	state: Type.String({ examples: ["11"] }),
	country: Type.String({ examples: ["FI"] }),
	latitude: Type.Number({ examples: [61.49805556] }),
	longitude: Type.Number({ examples: [23.76] }),
	timezone: Type.String({ examples: ["Europe/Helsinki"] }),
});

export const CitiesSchema = Type.Array(CitySchema);

export type City = Static<typeof CitySchema>;

export const CountryStateCitiesQuerySchema = Type.Object(paginationParams, {
	additionalProperties: false,
});

export const CitiesQuerySchema = Type.Object(
	{
		name: Type.Optional(Type.String()),
		country: Type.Optional(CountryCodeSchema),
		state: Type.Optional(StateCodeSchema),
		min_lat: Type.Optional(Latitude),
		max_lat: Type.Optional(Latitude),
		min_lon: Type.Optional(Longitude),
		max_lon: Type.Optional(Longitude),
		limit: Type.Optional(
			Type.Number({ minimum: 1, maximum: 250, default: 250 }),
		),
		offset: Type.Optional(Type.Number()),
	},
	{
		additionalProperties: false,
	},
);

export type CitiesQuery = Static<typeof CitiesQuerySchema>;
