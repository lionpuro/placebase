import { Type } from "@sinclair/typebox";

export const ErrorResponseSchema = Type.Object({ message: Type.String() });
