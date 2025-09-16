<script lang="ts">
	import type { Snippet } from "svelte";
	import Logo from "./logo.svelte";
	import Link from "./link.svelte";

	type Props = {
		class?: string;
		children?: Snippet;
	};
	const { class: className, children }: Props = $props();
</script>

<header class={`w-full border-b border-base-100 bg-base-white ${className ? className : ""}`}>
	<nav class={`mx-auto flex flex h-12 max-w-screen-xl items-center gap-8 px-5 py-2`}>
		<a href="/"><Logo /></a>
		<div class="flex">
			<Link href="/docs">Docs</Link>
		</div>
	</nav>
</header>
