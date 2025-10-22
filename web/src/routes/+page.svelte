<script lang="ts">
	import { session } from "$lib/auth/store.svelte";
	import Header from "$lib/components/header.svelte";
	import Main from "$lib/components/main.svelte";
	import Footer from "$lib/components/footer.svelte";
	import Link from "$lib/components/link.svelte";
	import { IconLinkExternal } from "$lib/icons";
	import Logo from "./_components/logo.svelte";
</script>

<svelte:head>
	<title>Placebase</title>
</svelte:head>
<Header />
<Main>
	<div class="mx-auto my-8 flex w-full max-w-screen-md flex-col gap-8 sm:my-16">
		<div class="flex flex-col items-center">
			<Logo />
			<h1 class="mt-2 mb-4 text-center text-4xl font-bold sm:text-5xl">Geographical Data API</h1>
			<p class="mb-4 text-center">
				Placebase provides an easy way to integrate global geographical data into your applications.
			</p>
			<div class="flex gap-2">
				{#if !session.isLoggedIn}
					<Link href="/signin" variant="button-primary" class="w-fit font-medium">Get started</Link>
				{:else}
					<Link href="/api-keys" variant="button-primary" class="w-fit font-medium">
						Get started
					</Link>
				{/if}
				<Link href="/docs" variant="button-secondary" class="w-fit font-medium">View docs</Link>
			</div>
		</div>
		<div class="flex gap-4 max-md:flex-col">
			<div class="flex basis-1/2 flex-col gap-2 rounded-lg border border-base-100 p-4">
				<h2 class="text-lg font-bold">Worldwide Coverage</h2>
				<p>
					Comprehensive dataset covering over 5000 states and 151,000 cities across 250 countries,
					all thanks to
					<Link
						href="https://github.com/dr5hn/countries-states-cities-database"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1 text-base-500"
					>
						Countries States Cities Database
						<IconLinkExternal />
					</Link>
				</p>
			</div>
			<div class="flex basis-1/2 flex-col gap-2 rounded-lg border border-base-100 p-4">
				<h2 class="text-lg font-bold">Free to use</h2>
				Completely free to use. Just sign up and get your free API key to start making queries.
			</div>
		</div>
	</div>
</Main>
<Footer />
