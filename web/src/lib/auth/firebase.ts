import { initializeApp, type FirebaseOptions } from "firebase/app";
import { env } from "$env/dynamic/public";
import {
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

export const auth = getAuth(app);

export function authStateListener(callback: NextOrObserver<User>) {
	return onAuthStateChanged(auth, callback);
}

export function signout() {
	return signOut(auth);
}
