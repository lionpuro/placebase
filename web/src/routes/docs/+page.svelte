<script lang="ts">
	import Header from "$lib/components/header.svelte";
	import { SwaggerUIBundle } from "swagger-ui-dist";
	import "swagger-ui-dist/swagger-ui.css";
	import { onMount } from "svelte";
	import Main from "$lib/components/main.svelte";
	import { PUBLIC_API_URL } from "$env/static/public";

	let container: HTMLDivElement;
	onMount(() => {
		SwaggerUIBundle({
			url: PUBLIC_API_URL + "/openapi.json",
			domNode: container,
			deepLinking: false, // incompatible with sveltekit router
		});
	});
</script>

<svelte:head>
	<title>API Reference - Placebase</title>
	<style lang="css">
		.swagger-ui .wrapper {
			padding: 0;
		}
		.swagger-ui * :not(.highlight-code *, code *) {
			font-family: "Geist Variable" !important;
		}
	</style>
</svelte:head>
<Header />
<Main>
	<div id="swagger-container" bind:this={container} class="mx-auto w-full max-w-screen-xl"></div>
</Main>
