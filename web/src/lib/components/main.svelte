<script lang="ts">
	const { children } = $props();
</script>

<main class="mx-auto flex max-w-screen-xl grow flex-col p-8">
	{@render children?.()}
</main>
