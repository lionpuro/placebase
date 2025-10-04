declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string;
			FIREBASE_TYPE: string;
			FIREBASE_PROJECT_ID: string;
			FIREBASE_PRIVATE_KEY_ID: string;
			FIREBASE_PRIVATE_KEY: string;
			FIREBASE_CLIENT_EMAIL: string;
			FIREBASE_CLIENT_ID: string;
			FIREBASE_AUTH_URI: string;
			FIREBASE_TOKEN_URI: string;
			FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string;
			FIREBASE_CLIENT_X509_CERT_URL: string;
			FIREBASE_UNIVERSE_DOMAIN: string;
		}
	}
}

export {};
