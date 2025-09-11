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
	name: Type.String(),
	iso2: Type.String(),
	type: Type.String(),
	country_code: Type.String(),
	latitude: Type.Number(),
	longitude: Type.Number(),
	timezone: Type.String(),
});

export type State = Static<typeof StateSchema>;
