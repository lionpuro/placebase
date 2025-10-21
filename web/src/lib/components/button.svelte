<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { cn } from "$lib/helpers/styles";
	const disabledClass =
		" disabled:bg-base-100/80 disabled:text-base-400 disabled:cursor-not-allowed";
	const config = {
		variants: {
			primary: "bg-primary-600/90 hover:bg-primary-600 text-base-white" + disabledClass,
			secondary: "bg-base-100/90 hover:bg-base-200/70 text-base-800" + disabledClass,
			outline: "hover:bg-base-50 outline outline-base-100" + disabledClass,
			black: "bg-base-950 hover:bg-base-950/95 text-base-white" + disabledClass,
		},
		sizes: {
			sm: "px-4 py-1.5 text-sm font-medium",
			md: "px-5 py-2",
		},
	};

	type ButtonVariant = keyof (typeof config)["variants"];
	type ButtonSize = keyof (typeof config)["sizes"];

	type Props = HTMLButtonAttributes & {
		variant?: ButtonVariant;
		size?: ButtonSize;
	};

	let { variant = "primary", size = "md", class: className, children, ...props }: Props = $props();

	function styles(variant: ButtonVariant, size: ButtonSize): string[] {
		const classes: string[] = [
			"flex items-center rounded-full",
			config.sizes[size],
			config.variants[variant],
		];
		if (className) {
			classes.push(className.toString());
		}
		return classes;
	}
</script>

<button class={cn(...styles(variant, size))} {...props}>{@render children?.()}</button>
