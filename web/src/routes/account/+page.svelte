<script>
	import { goto } from "$app/navigation";
	import { signout } from "$lib/auth/firebase";
	import { authStore } from "$lib/auth/store.svelte";
	import Header from "$lib/components/header.svelte";
	import Loading from "$lib/components/loading.svelte";
	import Main from "$lib/components/main.svelte";
	$effect(() => {
		if (!authStore.isLoading && !authStore.user) {
			goto("/signin");
		}
	});

	async function handleDelete() {
		const user = authStore.user;
		if (!user) {
			return;
		}
		const token = await user.getIdToken();
		const res = await fetch(`/api/internal/users/${user.uid}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) {
			console.error(res.statusText);
			return;
		}
		await signout();
		goto("/signin");
	}
</script>

<svelte:head>
	<title>Account - Placebase</title>
</svelte:head>
<Header />
<Main>
	{#if authStore.isLoading}
		<Loading />
	{:else if authStore.user}
		<div class="flex flex-col">
			<h1 class="mb-4 text-3xl font-bold sm:text-3xl">Account</h1>
			<div class="mb-2 flex">
				<span class="w-20 font-semibold">Email</span>
				<span class="text-base-600">{authStore.user.email}</span>
			</div>
			<div class="mb-4 flex">
				<span class="w-20 font-semibold">Name</span>
				<span class="text-base-600">{authStore.user.displayName}</span>
			</div>
			<button onclick={handleDelete} class="w-fit py-2 text-red-600/90">Delete account</button>
		</div>
	{/if}
</Main>
