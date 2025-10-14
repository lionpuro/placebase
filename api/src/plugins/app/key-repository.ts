import fp from "fastify-plugin";
import { FieldPath } from "firebase-admin/firestore";
import type { APIKeyRecord } from "../../schemas/api-key.js";
import { firebase } from "../../lib/firebase.js";

declare module "fastify" {
	export interface FastifyInstance {
		keyRepository: KeyRepository;
	}
}

export type KeyRepository = ReturnType<typeof createRepository>;

export function createRepository() {
	const db = () => firebase.firestore();
	return {
		async byUser(uid: string) {
			const snapshot = await db()
				.collection("api_keys")
				.where("user_id", "==", uid)
				.get();
			const records = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as APIKeyRecord[];
			return records;
		},
		async byHash(hash: string) {
			const snapshot = await db()
				.collection("api_keys")
				.where("hash", "==", hash)
				.get();
			const [record] = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as APIKeyRecord[];
			return record;
		},
		async create(hash: string, name: string, uid: string) {
			await db().collection("api_keys").doc().set({
				name: name,
				hash: hash,
				user_id: uid,
				created_at: now(),
			});
		},
		async delete(id: string, uid: string) {
			const snapshot = await db()
				.collection("api_keys")
				.where(FieldPath.documentId(), "==", id)
				.where("user_id", "==", uid)
				.get();
			const [doc] = snapshot.docs;
			if (!doc) {
				throw new Error("API key not found");
			}
			await doc.ref.delete();
		},
		async deleteByUser(uid: string) {
			const snapshot = await db()
				.collection("api_keys")
				.where("user_id", "==", uid)
				.get();
			await Promise.all([...snapshot.docs.map((doc) => doc.ref.delete())]);
		},
	};
}

function now() {
	return new Date(new Date().toUTCString()).toISOString();
}

export default fp((app) => {
	app.decorate("keyRepository", createRepository());
});
