<script>
	import { goto } from "$app/navigation";
	import { authStore } from "$lib/auth/store.svelte";
	import Header from "$lib/components/header.svelte";
	import Loading from "$lib/components/loading.svelte";
	import Main from "$lib/components/main.svelte";
	$effect(() => {
		if (!authStore.isLoading && !authStore.user) {
			goto("/signin");
		}
	});
</script>

<Header />
<Main>
	{#if authStore.isLoading}
		<Loading />
	{:else}
		<h1 class="mb-4 text-3xl font-bold sm:text-3xl">Dashboard</h1>
		<p class="mb-4">Hello, {authStore.user?.displayName}!</p>
		<div class="flex gap-2"></div>
	{/if}
</Main>
