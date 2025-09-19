<script lang="ts">
	import Logo from "./logo.svelte";
	import Link from "./link.svelte";
	import { authStore } from "$lib/auth/store.svelte";
	import { signout } from "$lib/auth/firebase";
	import { goto } from "$app/navigation";

	type Props = {
		class?: string;
	};
	const { class: className }: Props = $props();

	async function handleSignout() {
		await signout();
		authStore.reset();
		await goto("/");
	}
</script>

<header class={`w-full bg-base-white ${className ? className : ""}`}>
	<nav class={`mx-auto flex flex max-w-screen-xl items-center gap-8 px-6 py-4 sm:px-8`}>
		<a href="/"><Logo /></a>
		<div class="flex gap-6">
			<Link href="/docs">Docs</Link>
			{#if authStore.isLoggedIn}
				<Link href="/dashboard">Dashboard</Link>
			{/if}
		</div>
		<div class="ml-auto flex items-center gap-6">
			{#if !authStore.isLoggedIn}
				<a
					href="/signin"
					class="rounded-full bg-base-950 px-5 py-2 font-medium text-base-white hover:bg-base-950/95"
				>
					Sign in
				</a>
			{:else}
				<Link href="/account">Account</Link>
				<button
					onclick={handleSignout}
					class="rounded-full bg-base-100/60 px-5 py-2 text-red-500 hover:bg-base-100/90"
				>
					Sign out
				</button>
			{/if}
		</div>
	</nav>
</header>
