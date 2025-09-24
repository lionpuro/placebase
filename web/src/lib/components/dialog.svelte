<script lang="ts">
	import type { ClickEvent } from "$lib/types";
	import type { Snippet } from "svelte";

	type Props = {
		ref: HTMLDialogElement | undefined;
		onclose?: () => void;
		children?: Snippet;
		class?: string;
	};
	let { ref = $bindable(), children, class: className = "" }: Props = $props();

	function onclick(e: ClickEvent<HTMLDialogElement>) {
		if (!ref) {
			return;
		}
		const rect = ref.getBoundingClientRect();
		const isBackdrop =
			e.clientX < rect.left ||
			e.clientX > rect.right ||
			e.clientY < rect.top ||
			e.clientY > rect.bottom;
		if (isBackdrop) {
			ref.close();
		}
	}
</script>

<dialog
	bind:this={ref}
	{onclick}
	class="m-auto rounded-3xl backdrop:bg-[rgba(0,0,0,0.75)] {className}"
>
	{@render children?.()}
</dialog>
