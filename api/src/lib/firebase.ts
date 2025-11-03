import type { AppOptions } from "firebase-admin";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function options(): AppOptions {
	const {
		K_SERVICE,
		FIREBASE_PROJECT_ID,
		FIREBASE_PRIVATE_KEY,
		FIREBASE_CLIENT_EMAIL,
	} = process.env;

	// Use the default credentials when running in Google Cloud environment
	if (K_SERVICE !== undefined) {
		return {};
	}
	if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
		return {};
	}

	return {
		projectId: FIREBASE_PROJECT_ID,
		credential: cert({
			projectId: FIREBASE_PROJECT_ID,
			privateKey: JSON.parse(FIREBASE_PRIVATE_KEY),
			clientEmail: FIREBASE_CLIENT_EMAIL,
		}),
	};
}

function initApp() {
	return initializeApp(options(), "default");
}

const app = initApp();

export const firebase = {
	auth: () => getAuth(app),
	firestore: () => getFirestore(app),
};
