<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { cn } from "$lib/helpers/styles";

	const buttonBase = "flex items-center rounded-full px-5 py-2";
	const config = {
		variants: {
			default: "hover:text-primary-600",
			"button-primary": `bg-primary-600/90 hover:bg-primary-600 text-base-white ${buttonBase}`,
			"button-secondary": `bg-base-100/90 hover:bg-base-200/70 text-base-800 ${buttonBase}`,
			"button-black": `bg-base-950 hover:bg-base-950/95 text-base-white ${buttonBase}`,
		},
	};

	type Variant = keyof (typeof config)["variants"];

	type Props = {
		variant?: Variant;
		children?: Snippet;
	} & HTMLAnchorAttributes;

	const { variant = "default", class: className, children, ...props }: Props = $props();
</script>

<a class={cn([config.variants[variant], className])} {...props}>
	{@render children?.()}
</a>
