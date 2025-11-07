import { initializeApp, type FirebaseOptions } from "firebase/app";
import { env } from "$env/dynamic/public";
import {
	connectAuthEmulator,
	getAuth,
	onAuthStateChanged,
	signOut,
	type NextOrObserver,
	type User,
} from "firebase/auth";

const {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_AUTH_EMULATOR_URL,
} = env;

const config: FirebaseOptions = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID,
};

export function initializeFirebase() {
	return initializeApp(config);
}

export const app = initializeApp(config);

function initializeAuth() {
	if (PUBLIC_FIREBASE_AUTH_EMULATOR_URL) {
		const auth = getAuth();
		connectAuthEmulator(auth, PUBLIC_FIREBASE_AUTH_EMULATOR_URL);
		return auth;
	}
	return getAuth(app);
}

export const auth = initializeAuth();

export function authStateListener(callback: NextOrObserver<User>) {
	return onAuthStateChanged(auth, callback);
}

export function signout() {
	return signOut(auth);
}
