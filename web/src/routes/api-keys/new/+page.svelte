<script lang="ts">
	import { goto } from "$app/navigation";
	import { session } from "$lib/auth/store.svelte";
	import Header from "$lib/components/header.svelte";
	import Loading from "$lib/components/loading.svelte";
	import Main from "$lib/components/main.svelte";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import type { CreateAPIKeyRequest, CreateAPIKeyResponse } from "@placebase/api";
	import Button from "$lib/components/button.svelte";
	import { IconCopy } from "$lib/icons";

	$effect(() => {
		if (!session.isLoading && !session.user) {
			goto("/signin");
		}
	});

	let apiKey = $state<string | undefined>();

	let queryClient = useQueryClient();

	const generateQuery = createMutation({
		mutationKey: ["api-keys"],
		mutationFn: async (body: CreateAPIKeyRequest): Promise<CreateAPIKeyResponse> => {
			if (!session.user) {
				throw new Error("Failed to authenticate user");
			}
			const token = await session.user.getIdToken();
			const res = await fetch("/api/internal/api-keys", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			const result: CreateAPIKeyResponse = await res.json();
			return result;
		},
		onSuccess: async (result) => {
			apiKey = result.api_key;
			await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
		},
	});

	let keyName = $state<string | undefined>();

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!keyName) {
			return console.error("name is required");
		}
		$generateQuery.mutate({ name: keyName });
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
	<title>API keys - Placebase</title>
</svelte:head>
<Header />
<Main>
	{#if session.isLoading || !session.user}
		<Loading />
	{:else}
		<div class="mx-auto flex w-full max-w-screen-sm flex-col gap-6 p-6">
			{#if !apiKey}
				<h1 class="text-xl font-semibold">Create API key</h1>
				<form onsubmit={handleSubmit} class="flex flex-col gap-1">
					<label for="name">Key name</label>
					<input
						name="name"
						bind:value={keyName}
						class="mb-6 rounded-lg border border-base-200 px-3 py-1.5"
						onkeydown={(e) => e.key === "Enter" && e.preventDefault()}
						required
					/>
					<Button variant="primary" type="submit" class="w-fit">Create</Button>
				</form>
			{:else}
				<h1 class="text-xl font-semibold">Your new API key</h1>
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
							<IconCopy />
							Copy
						{:else}
							Copied!
						{/if}
					</button>
				</div>
				<p>
					This key won't be displayed again so you should save it somewhere safe. If you ever lose
					your key you'll have to deactivate it and generate a new one.
				</p>
				<a
					href="/api-keys"
					class="w-fit rounded-full bg-base-950 px-5 py-2 text-base-white hover:bg-base-950/95"
				>
					Continue
				</a>
			{/if}
		</div>
	{/if}
</Main>
