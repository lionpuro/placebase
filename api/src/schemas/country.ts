import { type Static, Type } from "@sinclair/typebox";

export const CountrySchema = Type.Object({
	name: Type.String({ examples: ["Finland"] }),
	iso2: Type.String({ examples: ["FI"] }),
	phonecode: Type.String({ examples: ["358"] }),
	capital: Type.String({ examples: ["Helsinki"] }),
	currency: Type.String({ examples: ["EUR"] }),
	native: Type.String({ examples: ["Suomi"] }),
	region: Type.String({ examples: ["Europe"] }),
	emoji: Type.String({ examples: ["🇫🇮"] }),
});

export const CountriesSchema = Type.Array(CountrySchema);

export type Country = Static<typeof CountrySchema>;
