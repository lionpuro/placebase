import type { LogLevel } from "fastify";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string;
			SWAGGER_SERVER_URL?: string;
			LOG_LEVEL?: LogLevel;
			K_SERVICE?: string; // Cloud Run service name
			FIREBASE_PROJECT_ID?: string;
			FIREBASE_AUTH_EMULATOR_HOST?: string;
			FIRESTORE_EMULATOR_HOST?: string;
		}
	}
}

export {};
