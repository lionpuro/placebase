import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import firebase from "fastify-firebase";

export default fp(async (app: FastifyInstance) => {
	const cert = {
		type: process.env.FIREBASE_TYPE,
		project_id: process.env.FIREBASE_PROJECT_ID,
		private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
		private_key: JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
		client_email: process.env.FIREBASE_CLIENT_EMAIL,
		client_id: process.env.FIREBASE_CLIENT_ID,
		auth_uri: process.env.FIREBASE_AUTH_URI,
		token_uri: process.env.FIREBASE_TOKEN_URI,
		auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
		client_x509_cert_url: process.env.FIREBASE_CERT_URL,
		universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
	};
	await app.register(firebase, cert);
});
