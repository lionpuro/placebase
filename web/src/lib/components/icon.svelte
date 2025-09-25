<script lang="ts">
	import "iconify-icon";
	type Props = {
		icon: string;
		style?: string;
		class?: string;
		width?: string | number;
		height?: string | number;
	};
	let { icon, ...props }: Props = $props();
</script>

<iconify-icon {icon} {...props}></iconify-icon>

<style lang="css">
	iconify-icon {
		display: inline-block;
		width: 1em;
		height: 1em;
	}
</style>
