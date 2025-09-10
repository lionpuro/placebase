import { type Static, type TSchema, Type } from "@sinclair/typebox";

export const Nullable = <T extends TSchema>(schema: T) => {
	return Type.Union([schema, Type.Null()]);
};

export const CountrySchema = Type.Object(
	{
		name: Type.String(),
		iso2: Type.String(),
		phonecode: Nullable(Type.String()),
		capital: Nullable(Type.String()),
		currency: Nullable(Type.String()),
		native: Nullable(Type.String()),
		region: Nullable(Type.String()),
		emoji: Nullable(Type.String()),
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
