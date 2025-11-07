import type { AppOptions } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function options(): AppOptions {
	const { K_SERVICE, FIREBASE_PROJECT_ID } = process.env;

	// Use the default credentials when running in Google Cloud environment
	if (K_SERVICE !== undefined) {
		return {};
	}
	if (FIREBASE_PROJECT_ID) {
		return { projectId: FIREBASE_PROJECT_ID };
	}
	return {};
}

function initApp() {
	return initializeApp(options(), "default");
}

const app = initApp();

export const firebase = {
	auth: () => getAuth(app),
	firestore: () => getFirestore(app),
};
