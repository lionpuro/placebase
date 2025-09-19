<script lang="ts">
	import { goto } from "$app/navigation";
	import { auth } from "$lib/auth/firebase";
	import Header from "$lib/components/header.svelte";
	import Main from "$lib/components/main.svelte";
	import IconGoogle from "$lib/icons/google.svelte";
	import { GoogleAuthProvider, signInWithPopup, type UserCredential } from "firebase/auth";
	async function signinWithGoogle() {
		const provider = new GoogleAuthProvider();
		try {
			const cred = await signInWithPopup(auth, provider);
			await createUser(cred);
			await goto("/dashboard");
		} catch (err) {
			console.error(err);
		}
	}
	async function createUser(cred: UserCredential) {
		const token = await cred.user.getIdToken();
		const res = await fetch(`/api/internal/users`, {
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) {
			throw new Error(res.statusText);
		}
	}
</script>

<svelte:head>
	<title>Sign in - Placebase</title>
</svelte:head>
<Header />
<Main>
	<div class="mx-auto my-8 flex flex-col items-center">
		<button
			onclick={signinWithGoogle}
			class="flex items-center gap-2 rounded-full bg-base-100/60 px-3 py-2 hover:bg-base-100"
		>
			<IconGoogle size={20} />
			Sign in with Google
		</button>
	</div>
</Main>
