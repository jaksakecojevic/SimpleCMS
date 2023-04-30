<script lang="ts">
	let tooltipVisible = false;
	export let text = '';
</script>

<span class="relative">
	<button on:mouseover={() => (tooltipVisible = true)} on:mouseout={() => (tooltipVisible = false)}> Hover me </button>
	{#if tooltipVisible}
		<div class="absolute z-10 rounded bg-black p-2 text-white">
			{text}
		</div>
	{/if}
</span>
