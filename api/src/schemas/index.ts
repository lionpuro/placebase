import { type Static, type TSchema, Type } from "@sinclair/typebox";

export const Nullable = <T extends TSchema>(schema: T) => {
	return Type.Union([schema, Type.Null()]);
};

export const CountrySchema = Type.Object(
	{
		name: Type.String(),
		iso2: Type.String(),
		phonecode: Type.String(),
		capital: Type.String(),
		currency: Type.String(),
		native: Type.String(),
		region: Type.String(),
		emoji: Type.String(),
	},
	{
		examples: [
			{
				name: "Finland",
				iso2: "FI",
				phonecode: "358",
				capital: "Helsinki",
				currency: "EUR",
				native: "Suomi",
				region: "Europe",
				emoji: "🇫🇮",
			},
		],
	},
);

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
