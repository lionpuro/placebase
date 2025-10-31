<script lang="ts">
	import { goto } from "$app/navigation";
	import { auth } from "$lib/auth/firebase";
	import { session } from "$lib/auth/store.svelte";
	import Header from "$lib/components/header.svelte";
	import Main from "$lib/components/main.svelte";
	import Footer from "$lib/components/footer.svelte";
	import { IconGoogle } from "$lib/icons";
	import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
	import Loading from "$lib/components/loading.svelte";
	async function signinWithGoogle() {
		session.isLoading = true;
		const provider = new GoogleAuthProvider();
		try {
			await signInWithRedirect(auth, provider);
		} catch (err) {
			console.error(err);
			session.isLoading = false;
		}
	}
	$effect(() => {
		if (session.user) {
			goto("/api-keys");
		}
	});
</script>

<svelte:head>
	<title>Sign in - Placebase</title>
</svelte:head>
<Header />
<Main>
	{#if session.isLoading}
		<Loading />
	{:else}
		<div class="mx-auto my-8 flex flex-col items-center">
			<button
				onclick={signinWithGoogle}
				class="flex items-center gap-2 rounded-full bg-base-100/60 px-3 py-2 hover:bg-base-100"
			>
				<IconGoogle size={20} />
				Sign in with Google
			</button>
		</div>
	{/if}
</Main>
<Footer />
