import { type Static, Type } from "@sinclair/typebox";

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
