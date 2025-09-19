<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onMount } from "svelte";
	import { authStore } from "$lib/auth/store.svelte";
	import { authStateListener } from "$lib/auth/firebase";

	let { children } = $props();

	onMount(() => {
		const unsubscribe = authStateListener((user) => {
			authStore.user = user;
			authStore.isLoading = false;
		});
		return unsubscribe;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="flex min-h-full flex-col">
	{@render children?.()}
</div>
