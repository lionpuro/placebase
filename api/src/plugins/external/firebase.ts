import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import fb from "firebase-admin";

declare module "fastify" {
	interface FastifyInstance {
		firebase: fb.app.App;
	}
}

type Cert = {
	project_id?: string;
	private_key?: string;
	client_email?: string;
	projectId?: string;
	privateKey?: string;
	clientEmail?: string;
};

type FastifyFirebase = FastifyPluginAsync<Cert>;

const fastifyFirebase: FastifyFirebase = async (fastify, opts) => {
	const cert = opts || {};
	const projectId = cert.projectId || cert.project_id;
	const privateKey = cert.privateKey || cert.private_key;
	const clientEmail = cert.clientEmail || cert.client_email;

	// Prevent multiple initializations
	let firebaseInstance;
	try {
		if (fb.apps && fb.apps.length > 0) {
			firebaseInstance = fb.app("default");
		} else if (!projectId || !privateKey || !clientEmail) {
			firebaseInstance = fb.initializeApp({}, "default");
		} else {
			firebaseInstance = fb.initializeApp(
				{
					projectId,
					credential: fb.credential.cert({
						projectId,
						privateKey,
						clientEmail,
					}),
				},
				"default",
			);
		}

		fastify.decorate("firebase", firebaseInstance);
	} catch (err) {
		const error = err instanceof Error ? err.message : err;
		throw new Error(`fastify-firebase(plugin): ${error}`);
	}
};

const firebase = fp(fastifyFirebase, {
	fastify: ">=5.0.0",
	name: "fastify-firebase",
});

export default fp(async (app: FastifyInstance) => {
	const isGCR = process.env.K_SERVICE !== undefined;
	if (isGCR) {
		await app.register(firebase);
		return;
	}
	const opts = {
		project_id: process.env.FIREBASE_PROJECT_ID,
		private_key: JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
		client_email: process.env.FIREBASE_CLIENT_EMAIL,
	};
	await app.register(firebase, opts);
});
