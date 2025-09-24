<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onMount } from "svelte";
	import { authStore } from "$lib/auth/store.svelte";
	import { authStateListener } from "$lib/auth/firebase";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

	let { children } = $props();

	onMount(() => {
		const unsubscribe = authStateListener((user) => {
			authStore.user = user;
			authStore.isLoading = false;
		});
		return unsubscribe;
	});

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			},
		},
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<QueryClientProvider client={queryClient}>
	<div class="flex min-h-full flex-col">
		{@render children?.()}
	</div>
</QueryClientProvider>
