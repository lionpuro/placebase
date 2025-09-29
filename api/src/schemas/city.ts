import { type Static, Type } from "@sinclair/typebox";

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
