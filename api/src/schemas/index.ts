import { type Static, type TSchema, Type } from "@sinclair/typebox";

export const Nullable = <T extends TSchema>(schema: T) => {
	return Type.Union([schema, Type.Null()]);
};

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

export type Country = Static<typeof CountrySchema>;

export const StateSchema = Type.Object({
	name: Type.String({ examples: ["Pirkanmaa"] }),
	iso2: Type.String({ examples: ["11"] }),
	type: Type.String({ examples: ["region"] }),
	country_code: Type.String({ examples: ["FI"] }),
	latitude: Type.Number({ examples: [61.717433] }),
	longitude: Type.Number({ examples: [23.7157115] }),
	timezone: Type.String({ examples: ["Europe/Helsinki"] }),
});

export type State = Static<typeof StateSchema>;
