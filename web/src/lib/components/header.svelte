<script lang="ts">
	import Logo from "./logo.svelte";
	import Link from "./link.svelte";
	import { session } from "$lib/auth/store.svelte";
	import { signout } from "$lib/auth/firebase";
	import { goto } from "$app/navigation";
	import Button from "./button.svelte";
	import ScrollArea from "./scroll-area.svelte";
	import { Popover } from "bits-ui";
	import { IconClose, IconMenu } from "$lib/icons";

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();

	let menuOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && menuOpen) {
			menuOpen = false;
		}
	}

	async function handleSignout() {
		await signout();
		session.delete();
		await goto("/");
	}
</script>

<svelte:window onkeydown={handleKeydown} />
<header class={`w-full bg-base-white ${className ? className : ""}`}>
	<nav
		class={`mx-auto flex flex max-w-screen-xl items-center gap-6 px-6 py-3 sm:gap-8 sm:px-8 sm:py-4`}
	>
		<a href="/"><Logo /></a>
		{#if !session.isLoggedIn}
			<Link href="/docs">Docs</Link>
			<Link href="/signin" variant="button-black" class="ml-auto font-medium">Sign in</Link>
		{:else}
			<div class="flex w-full items-center gap-6 max-sm:hidden">
				<Link href="/docs">Docs</Link>
				<Link href="/api-keys">API keys</Link>
				<Link href="/account" class="ml-auto">Account</Link>
				<Button variant="outline" class="text-red-500" onclick={handleSignout}>Sign out</Button>
			</div>
			<Popover.Root bind:open={menuOpen}>
				<Popover.Trigger
					class="ml-auto flex size-10 cursor-pointer items-center justify-center hover:text-primary-600 sm:hidden"
				>
					{#if !menuOpen}
						<IconMenu width="24" height="24" />
					{:else}
						<IconClose width="24" height="24" />
					{/if}
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content
						class="border border-base-100 bg-base-white sm:hidden"
						align="start"
						side="bottom"
						sideOffset={16}
						preventScroll
					>
						<ScrollArea
							class="mt-2 h-(--bits-popover-content-available-height) max-h-none w-(--bits-popover-content-available-width) max-w-none"
						>
							<div class="flex flex-col p-6 pt-2">
								<Link href="/docs" class="p-2">Docs</Link>
								<Link href="/api-keys" class="p-2">API keys</Link>
								<Link href="/account" class="p-2">Account</Link>
								<button class="p-2 text-left text-red-500" onclick={handleSignout}>
									Sign out
								</button>
							</div>
						</ScrollArea>
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		{/if}
	</nav>
</header>
