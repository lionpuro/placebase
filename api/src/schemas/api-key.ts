import { type Static, Type } from "@sinclair/typebox";

export const APIKeyRecordSchema = Type.Object({
	id: Type.String(),
	name: Type.String(),
	user_id: Type.String(),
	created_at: Type.String(),
});

export type APIKeyRecord = Static<typeof APIKeyRecordSchema>;

export const CreateAPIKeyRequestSchema = Type.Object({
	name: Type.String(),
});

export type CreateAPIKeyRequest = Static<typeof CreateAPIKeyRequestSchema>;

export const CreateAPIKeyResponseSchema = Type.Object({
	api_key: Type.String(),
});

export type CreateAPIKeyResponse = Static<typeof CreateAPIKeyResponseSchema>;
