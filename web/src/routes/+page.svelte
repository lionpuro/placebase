<script>
	import { authStore } from "$lib/auth/store.svelte";
	import Header from "$lib/components/header.svelte";
	import Main from "$lib/components/main.svelte";
</script>

<svelte:head>
	<title>Placebase</title>
</svelte:head>
<Header />
<Main>
	<div class="mx-auto my-16 flex flex-col items-center">
		<h1 class="mb-4 text-center text-3xl font-bold sm:text-5xl">Location API</h1>
		<p class="mb-4">No hassle access to countries, states and cities data</p>
		<div class="flex gap-2">
			{#if !authStore.isLoggedIn}
				<a
					href="/signin"
					class="w-fit rounded-full bg-primary-600/90 px-5 py-2 font-medium text-white hover:bg-primary-600"
				>
					Get started
				</a>
			{:else}
				<a
					href="/dashboard"
					class="w-fit rounded-full bg-primary-600/90 px-5 py-2 font-medium text-white hover:bg-primary-600"
				>
					Dashboard
				</a>
			{/if}
			<a
				href="/docs"
				class="w-fit rounded-full bg-base-100/90 px-5 py-2 font-medium text-base-800 hover:bg-base-200/70"
			>
				View docs
			</a>
		</div>
	</div>
</Main>
