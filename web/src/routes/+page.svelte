<script lang="ts">
	import { session } from "$lib/auth/store.svelte";
	import Header from "$lib/components/header.svelte";
	import Main from "$lib/components/main.svelte";
	import Link from "$lib/components/link.svelte";
</script>

<svelte:head>
	<title>Placebase</title>
</svelte:head>
<Header />
<Main>
	<div class="mx-auto my-16 flex flex-col items-center">
		<h1 class="mb-4 text-center text-3xl font-bold sm:text-5xl">Places API</h1>
		<p class="mb-4">No hassle access to countries, states and cities data</p>
		<div class="flex gap-2">
			{#if !session.isLoggedIn}
				<Link href="/signin" variant="button-primary" class="w-fit font-medium">Get started</Link>
			{:else}
				<Link href="/api-keys" variant="button-primary" class="w-fit font-medium">Get started</Link>
			{/if}
			<Link href="/docs" variant="button-secondary" class="w-fit font-medium">View docs</Link>
		</div>
	</div>
</Main>
