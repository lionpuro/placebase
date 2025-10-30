<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onMount, type Snippet } from "svelte";
	import { session } from "$lib/auth/store.svelte";
	import { authStateListener } from "$lib/auth/firebase";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

	type Props = { children: Snippet };
	let { children }: Props = $props();

	onMount(() => {
		const unsubscribe = authStateListener((user) => {
			session.update(user);
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
	<meta
		name="description"
		content="Free REST API that provides up‑to‑date country, region, and city data worldwide."
	/>
</svelte:head>
<QueryClientProvider client={queryClient}>
	<div class="flex min-h-full flex-col">
		{@render children?.()}
	</div>
</QueryClientProvider>
