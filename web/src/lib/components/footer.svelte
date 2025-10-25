<script lang="ts">
	import Link from "./link.svelte";
	import { IconGithub } from "$lib/icons";
</script>

<footer class="mx-auto mt-16 w-full max-w-screen-xl px-6 sm:px-8">
	<div class="flex flex-col gap-2 border-t border-base-100 py-4">
		<div class="flex items-center text-sm text-base-500">
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
	</div>
</footer>
