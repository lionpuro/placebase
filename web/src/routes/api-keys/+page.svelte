<script lang="ts">
	import { goto } from "$app/navigation";
	import { session } from "$lib/auth/store.svelte";
	import Header from "$lib/components/header.svelte";
	import Main from "$lib/components/main.svelte";
	import Footer from "$lib/components/footer.svelte";
	import Loading from "$lib/components/loading.svelte";
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import type { APIKeyRecord } from "@placebase/api";
	import { IconTrash } from "$lib/icons";
	import Link from "$lib/components/link.svelte";

	$effect(() => {
		if (!session.isLoading && !session.user) {
			goto("/signin");
		}
	});

	let queryClient = useQueryClient();

	const getQuery = createQuery({
		queryKey: ["api-keys"],
		queryFn: async (): Promise<APIKeyRecord[]> => {
			if (!session.user) {
				throw new Error("Failed to authenticate user");
			}
			const token = await session.user.getIdToken();
			const res = await fetch("/api/internal/api-keys", {
				method: "GET",
				headers: { Authorization: "Bearer " + token },
			});
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			return res.json();
		},
	});

	const deleteQuery = createMutation({
		mutationKey: ["api-keys"],
		mutationFn: async (id: string): Promise<void> => {
			if (!session.user) {
				throw new Error("Failed to authenticate user");
			}
			const token = await session.user.getIdToken();
			const res = await fetch(`/api/internal/api-keys/${id}`, {
				method: "DELETE",
				headers: { Authorization: "Bearer " + token },
			});
			if (!res.ok) {
				throw new Error(res.statusText);
			}
		},
		onError: (err) => console.error(err),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["api-keys"] }),
	});
</script>

<svelte:head>
	<title>API keys - Placebase</title>
</svelte:head>
<Header />
<Main>
	{#if session.isLoading || !session.user}
		<Loading />
	{:else}
		<div class="mb-4 flex items-center justify-between">
			<h1 class="text-xl font-bold sm:text-3xl">API keys</h1>
			<Link href="/api-keys/new" variant="button-black">Create key</Link>
		</div>
		<p class="mb-2">
			You will have to provide an access key in the
			<code class="rounded-lg border border-base-100 px-1.5 py-0.5 text-primary-600">
				X-API-KEY
			</code>
			header when making requests.
		</p>
		<span class="mb-4 flex flex-wrap items-center gap-2">
			<strong class="font-semibold">Example:</strong>
			<code class="rounded-lg border border-base-100 px-2 py-0.5 text-sm">
				curl <span class="whitespace-nowrap">https://api.placebase.xyz/countries</span>
				<span class="whitespace-nowrap">
					-H "X-API-KEY: <span class="text-primary-600">{"<YOUR_API_KEY>"}</span>"
				</span>
			</code>
		</span>
		{#if $getQuery.isPending}
			<Loading />
		{:else if $getQuery.isError}
			<p class="col-span-3 col-start-1 text-red-600/80">{$getQuery.error.message}</p>
		{:else if $getQuery.isSuccess}
			<div
				class="grid grid-cols-[minmax(0,1fr)_auto_minmax(min-content,min-content)] gap-y-px bg-base-100"
			>
				<div class="bg-base-white px-2 py-1 font-medium text-base-500">Name</div>
				<div class="col-span-2 col-start-2 bg-base-white px-2 py-1 font-medium text-base-500">
					Created
				</div>
				{#if $getQuery.data.length < 1}
					<p class="col-span-3 col-start-1 bg-base-white p-2 text-base-500 max-sm:text-sm">
						No API keys
					</p>
				{:else}
					{#each $getQuery.data as record}
						<div class="col-start-1 flex items-center bg-base-white px-2 py-1 max-sm:text-sm">
							{record.name}
						</div>
						<div class="col-start-2 flex items-center bg-base-white px-2 py-1 max-sm:text-sm">
							{new Date(record.created_at).toLocaleString(window.navigator.language)}
						</div>
						<button
							title="Delete"
							onclick={() => $deleteQuery.mutate(record.id)}
							class="bg-base-white p-2 text-xl text-red-600/80 hover:text-red-600"
						>
							<IconTrash />
						</button>
					{/each}
				{/if}
			</div>
		{/if}
	{/if}
</Main>
<Footer />
