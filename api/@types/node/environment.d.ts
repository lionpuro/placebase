import type { LogLevel } from "fastify";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string;
			API_URL?: string;
			LOG_LEVEL?: LogLevel;
			FIREBASE_PROJECT_ID: string;
			FIREBASE_PRIVATE_KEY: string;
			FIREBASE_CLIENT_EMAIL: string;
		}
	}
}

export {};
