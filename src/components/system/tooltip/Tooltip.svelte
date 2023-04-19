<script lang="ts">
	let tooltipVisible = false;
	export let text = '';
</script>

<span class="relative">
	<button on:mouseover={() => (tooltipVisible = true)} on:mouseout={() => (tooltipVisible = false)}> Hover me </button>
	{#if tooltipVisible}
		<div class="absolute z-10 p-2 bg-black text-white rounded">
			{text}
		</div>
	{/if}
</span>
