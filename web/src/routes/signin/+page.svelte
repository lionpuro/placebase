<script>
	import { goto } from "$app/navigation";
	import { auth } from "$lib/auth/firebase";
	import Header from "$lib/components/header.svelte";
	import Main from "$lib/components/main.svelte";
	import IconGoogle from "$lib/icons/google.svelte";
	import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
	async function signinWithGoogle() {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
			await goto("/dashboard");
		} catch (err) {
			console.error(err);
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
