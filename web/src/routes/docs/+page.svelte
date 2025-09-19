<script lang="ts">
	import Header from "$lib/components/header.svelte";
	import { SwaggerUIBundle } from "swagger-ui-dist";
	import "swagger-ui-dist/swagger-ui.css";
	import { onMount } from "svelte";
	import Main from "$lib/components/main.svelte";

	let container: HTMLDivElement;
	onMount(() => {
		SwaggerUIBundle({
			url: "/api/openapi.json",
			domNode: container,
			deepLinking: false, // incompatible with sveltekit router
		});
	});
</script>

<svelte:head>
	<title>API Reference - Placebase</title>
</svelte:head>
<Header />
<Main>
	<div id="swagger-container" bind:this={container} class="mx-auto w-full max-w-screen-xl"></div>
</Main>
