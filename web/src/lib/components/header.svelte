<script lang="ts">
	import Logo from "./logo.svelte";
	import Link from "./link.svelte";
	import Icon from "./icon.svelte";
	import { authStore } from "$lib/auth/store.svelte";
	import { signout } from "$lib/auth/firebase";
	import { goto } from "$app/navigation";
	import Button from "./button.svelte";

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();

	let menuOpen = $state(false);

	const toggleMenu = () => (menuOpen = !menuOpen);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && menuOpen) {
			menuOpen = false;
		}
	}

	async function handleSignout() {
		await signout();
		authStore.reset();
		await goto("/");
	}
</script>

<svelte:window onkeydown={handleKeydown} />
<header class={`w-full bg-base-white ${className ? className : ""}`}>
	<nav class={`relative mx-auto flex flex max-w-screen-xl items-center gap-8 px-6 py-4 sm:px-8`}>
		<a href="/"><Logo /></a>
		{#if !authStore.isLoggedIn}
			<Link href="/docs">Docs</Link>
			<a
				href="/signin"
				class="ml-auto rounded-full bg-base-950 px-5 py-2 font-medium text-base-white hover:bg-base-950/95"
			>
				Sign in
			</a>
		{:else}
			<div
				class="{!menuOpen
					? 'max-sm:hidden'
					: 'border-base-100 max-sm:fixed max-sm:top-18 max-sm:right-4 max-sm:z-10 max-sm:min-w-48 max-sm:flex-col max-sm:rounded-2xl max-sm:border max-sm:bg-base-white max-sm:p-4'} flex sm:w-full sm:items-center sm:gap-6"
			>
				<Link href="/docs" class="max-sm:p-2">Docs</Link>
				<Link href="/dashboard" class="max-sm:p-2">Dashboard</Link>
				<Link href="/account" class="max-sm:p-2 sm:ml-auto">Account</Link>
				<Button variant="outline" class="text-red-500 max-sm:mt-2" onclick={handleSignout}>
					Sign out
				</Button>
			</div>
			<button onclick={toggleMenu} class="ml-auto p-2 hover:text-primary-600 sm:hidden">
				{#if !menuOpen}
					<Icon icon="mdi:menu" width="24" height="24" />
				{:else}
					<Icon icon="mdi:close" width="24" height="24" />
				{/if}
			</button>
		{/if}
	</nav>
</header>
