<script lang="ts">
	import Link from "./link.svelte";
	import { IconGithub } from "$lib/icons";
</script>

<footer class="mx-auto mt-16 flex w-full max-w-screen-xl px-6 py-2 sm:px-8">
	<div class="flex w-full items-center text-sm text-base-500">
		<Link href="/">placebase.xyz</Link>
		<Link
			href="https://github.com/lionpuro/placebase"
			target="_blank"
			rel="noopener noreferrer"
			title="Github"
			class="ml-auto"
		>
			<IconGithub />
		</Link>
	</div>
</footer>
