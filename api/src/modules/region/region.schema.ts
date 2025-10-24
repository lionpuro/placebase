import { type Static, Type } from "@sinclair/typebox";
import {
	CountryCodeSchema,
	paginationParams,
	RegionCodeSchema,
} from "../../lib/schemas/common.js";

export const RegionSchema = Type.Object({
	name: Type.String({ examples: ["Pirkanmaa"] }),
	iso2: Type.String({ examples: ["11"] }),
	type: Type.String({ examples: ["state", "region", "province"] }),
	country: Type.String({ examples: ["FI"] }),
	latitude: Type.Number({ examples: [61.717433] }),
	longitude: Type.Number({ examples: [23.7157115] }),
	timezone: Type.String({ examples: ["Europe/Helsinki"] }),
});

export const RegionsSchema = Type.Array(RegionSchema);

export type Region = Static<typeof RegionSchema>;

export const CountryRegionsQuerySchema = Type.Object(paginationParams, {
	additionalProperties: false,
});

export const RegionsQuerySchema = Type.Object(
	{
		name: Type.Optional(Type.String()),
		iso_code: Type.Optional(RegionCodeSchema),
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

export type RegionsQuery = Static<typeof RegionsQuerySchema>;
