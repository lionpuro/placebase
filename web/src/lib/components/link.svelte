<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	type Props = {
		children?: Snippet;
	} & HTMLAnchorAttributes;

	const { class: className, children, ...props }: Props = $props();
</script>

<a class={["hover:text-primary-600", className].filter((cn) => !!cn).join(" ")} {...props}>
	{@render children?.()}
</a>
