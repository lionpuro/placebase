import { type Static, Type } from "@sinclair/typebox";
import { paginationParams } from "../../lib/schemas/common.js";

export const CountrySchema = Type.Object({
	name: Type.String({ examples: ["Finland"] }),
	iso2: Type.String({ examples: ["FI"] }),
	phonecode: Type.String({ examples: ["358"] }),
	capital: Type.String({ examples: ["Helsinki"] }),
	currency: Type.String({ examples: ["EUR"] }),
	native: Type.String({ examples: ["Suomi"] }),
	continent: Type.String({ examples: ["Europe"] }),
	emoji: Type.String({ examples: ["🇫🇮"] }),
});

export const CountriesSchema = Type.Array(CountrySchema);

export type Country = Static<typeof CountrySchema>;

export const CountriesQuerySchema = Type.Object(
	{
		name: Type.Optional(Type.String()),
		currency: Type.Optional(Type.String({ minLength: 3, maxLength: 3 })),
		continent: Type.Optional(Type.String()),
		phonecode: Type.Optional(Type.String({ examples: ["358"] })),
		...paginationParams,
	},
	{
		additionalProperties: false,
	},
);

export type CountriesQuery = Static<typeof CountriesQuerySchema>;
