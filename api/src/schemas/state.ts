import { type Static, Type } from "@sinclair/typebox";
import {
	CountryCodeSchema,
	paginationParams,
	StateCodeSchema,
} from "./common.js";

export const StateSchema = Type.Object({
	name: Type.String({ examples: ["Pirkanmaa"] }),
	iso2: Type.String({ examples: ["11"] }),
	type: Type.String({ examples: ["region"] }),
	country: Type.String({ examples: ["FI"] }),
	latitude: Type.Number({ examples: [61.717433] }),
	longitude: Type.Number({ examples: [23.7157115] }),
	timezone: Type.String({ examples: ["Europe/Helsinki"] }),
});

export const StatesSchema = Type.Array(StateSchema);

export type State = Static<typeof StateSchema>;

export const CountryStatesQuerySchema = Type.Object(paginationParams, {
	additionalProperties: false,
});

export const StatesQuerySchema = Type.Object(
	{
		name: Type.Optional(Type.String()),
		iso_code: Type.Optional(StateCodeSchema),
		country: Type.Optional(CountryCodeSchema),
		limit: Type.Optional(
			Type.Number({ minimum: 1, maximum: 250, default: 250 }),
		),
		offset: Type.Optional(Type.Number()),
	},
	{
		additionalProperties: false,
	},
);

export type StatesQuery = Static<typeof StatesQuerySchema>;
