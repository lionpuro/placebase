<script lang="ts">
	import Logo from "./logo.svelte";
	import Link from "./link.svelte";

	type Props = {
		class?: string;
	};
	const { class: className }: Props = $props();
</script>

<header class={`w-full bg-base-white ${className ? className : ""}`}>
	<nav class={`mx-auto flex flex max-w-screen-xl items-center gap-8 px-6 py-4 sm:px-8`}>
		<a href="/"><Logo /></a>
		<div class="flex">
			<Link href="/docs">Docs</Link>
		</div>
	</nav>
</header>
