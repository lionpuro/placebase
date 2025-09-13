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

export const CountriesSchema = Type.Array(CountrySchema);

export type Country = Static<typeof CountrySchema>;

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
