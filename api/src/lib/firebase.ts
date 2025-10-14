import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initApp() {
	// Running in Google Cloud environment
	if (process.env.K_SERVICE !== undefined) {
		return initializeApp({}, "default");
	}

	const projectID = process.env.FIREBASE_PROJECT_ID;
	return initializeApp(
		{
			projectId: projectID,
			credential: cert({
				projectId: projectID,
				privateKey: JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			}),
		},
		"default",
	);
}

const app = initApp();

export const firebase = {
	auth: () => getAuth(app),
	firestore: () => getFirestore(app),
};
