<script lang="ts">
	const { children } = $props();
</script>

<main class="mx-auto flex w-full max-w-screen-xl grow flex-col p-6 sm:p-8">
	{@render children?.()}
</main>
