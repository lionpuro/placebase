<script lang="ts">
	import { goto } from "$app/navigation";
	import { authStore } from "$lib/auth/store.svelte";
	import Header from "$lib/components/header.svelte";
	import Loading from "$lib/components/loading.svelte";
	import Main from "$lib/components/main.svelte";
	import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
	import type { APIKeyRecord, CreateAPIKeyResponse } from "@placebase/api";
	import Dialog from "$lib/components/dialog.svelte";
	import Icon from "@iconify/svelte";

	$effect(() => {
		if (!authStore.isLoading && !authStore.user) {
			goto("/signin");
		}
	});

	let apiKey = $state<string | undefined>();
	let dialog = $state<HTMLDialogElement | undefined>(undefined);

	let queryClient = useQueryClient();

	const getQuery = createQuery({
		queryKey: ["api-keys"],
		queryFn: async (): Promise<APIKeyRecord[]> => {
			if (!authStore.user) {
				throw new Error("Failed to authenticate user");
			}
			const token = await authStore.user.getIdToken();
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

	const generateQuery = createMutation({
		mutationKey: ["api-keys"],
		mutationFn: async (): Promise<CreateAPIKeyResponse> => {
			if (!authStore.user) {
				throw new Error("Failed to authenticate user");
			}
			const token = await authStore.user.getIdToken();
			const res = await fetch("/api/internal/api-keys", {
				method: "POST",
				headers: { Authorization: "Bearer " + token },
			});
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			const result: CreateAPIKeyResponse = await res.json();
			return result;
		},
		onSuccess: async (result) => {
			apiKey = result.api_key;
			dialog?.showModal();
			await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
		},
	});

	const deleteQuery = createMutation({
		mutationKey: ["api-keys"],
		mutationFn: async (id: string): Promise<void> => {
			if (!authStore.user) {
				throw new Error("Failed to authenticate user");
			}
			const token = await authStore.user.getIdToken();
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

	async function generate() {
		await $generateQuery.mutateAsync();
	}

	let keyCopied = $state(false);
	function handleCopy() {
		if (!apiKey) return;
		keyCopied = true;
		navigator.clipboard.writeText(apiKey);
		setTimeout(() => {
			keyCopied = false;
		}, 2000);
	}
</script>

<svelte:head>
	<title>Dashboard - Placebase</title>
</svelte:head>
<Header />
<Main>
	{#if authStore.isLoading || !authStore.user}
		<Loading />
	{:else}
		<h1 class="mb-4 text-3xl font-bold sm:text-3xl">Dashboard</h1>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-semibold">API keys</h2>
			<button
				onclick={generate}
				class="rounded-full bg-primary-600/90 px-5 py-2 text-base-white hover:bg-primary-600"
			>
				Generate API key
			</button>
		</div>
		<Dialog bind:ref={dialog} onclose={() => (apiKey = undefined)}>
			<div class="flex flex-col gap-6 p-6">
				<h3 class="text-xl font-semibold">Your new API key</h3>
				{#if apiKey}
					<div class="flex gap-2 rounded-full border border-base-100 p-0.5">
						<span class="flex items-center overflow-x-auto rounded-full px-2 py-1 text-nowrap">
							{apiKey}
						</span>
						<button
							onclick={handleCopy}
							disabled={keyCopied}
							class="ml-auto flex w-24 items-center justify-center gap-1 rounded-full bg-primary-600/90 px-3 py-0.5 text-sm font-medium text-base-white hover:bg-primary-600"
						>
							{#if !keyCopied}
								<Icon icon="mdi:content-copy" />
								Copy
							{:else}
								Copied!
							{/if}
						</button>
					</div>
				{/if}
				<p>This key won't be displayed again so you should save it somewhere safe.</p>
				<button
					onclick={() => dialog?.close()}
					class="w-fit rounded-full bg-base-950 px-5 py-2 text-base-white hover:bg-base-900"
				>
					Continue
				</button>
			</div>
		</Dialog>
		{#if $getQuery.isPending}
			<Loading />
		{:else if $getQuery.isError}
			<p class="col-span-3 col-start-1 text-red-600/80">{$getQuery.error.message}</p>
		{:else if $getQuery.isSuccess}
			<div
				class="grid grid-cols-[minmax(0,1fr)_auto_minmax(min-content,min-content)] gap-y-px bg-base-100"
			>
				<div class="bg-base-white px-2 py-1 font-medium text-base-500">ID</div>
				<div class="col-span-2 col-start-2 bg-base-white px-2 py-1 font-medium text-base-500">
					Created
				</div>
				{#if $getQuery.data.length < 1}
					<p class="col-span-3 col-start-1 bg-base-white px-2 py-1 text-base-500">No API keys</p>
				{:else}
					{#each $getQuery.data as record}
						<div class="col-start-1 flex items-center bg-base-white px-2 py-1 max-sm:text-sm">
							{record.id}
						</div>
						<div class="col-start-2 flex items-center bg-base-white px-2 py-1 max-sm:text-sm">
							{new Date(record.created_at).toLocaleString(window.navigator.language)}
						</div>
						<button
							title="Delete"
							onclick={() => $deleteQuery.mutate(record.id)}
							class="bg-base-white p-2 text-xl text-red-600/80 hover:text-red-600"
						>
							<Icon icon="mdi:trash" />
						</button>
					{/each}
				{/if}
			</div>
		{/if}
	{/if}
</Main>
