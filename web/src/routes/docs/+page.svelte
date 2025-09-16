<script lang="ts">
	import Header from "$lib/components/header.svelte";
	import { createApiReference } from "@scalar/api-reference";
	import { onMount } from "svelte";

	let loading = $state(true);
	let container: HTMLDivElement;
	onMount(() => {
		createApiReference(container, {
			url: "/api/openapi.json",
			theme: "alternate",
			defaultOpenAllTags: true,
			withDefaultFonts: false,
			forceDarkModeState: "light",
			hideDarkModeToggle: true,
			hideClientButton: true,
			onLoaded: () => {
				loading = false;
			},
		});
	});
</script>

<Header class="fixed z-10" />
<div
	bind:this={container}
	class="scalar mx-auto w-full max-w-screen-xl {loading ? 'hidden' : ''}"
></div>
<svelte:head>
	<style>
		.light-mode {
			--scalar-background-1: var(--color-base-white);
			--scalar-custom-header-height: 49px;
			--scalar-font: "Geist Variable";
		}

		.scalar main {
			padding-top: 49px;
		}

		.scalar .sidebar {
			--scalar-border-color: transparent;
		}
	</style>
</svelte:head>
