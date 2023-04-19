<script lang="ts">
	export let value: number | undefined = 0;
	export let min = 0;
	export let max = 100;
	export let height = 'h-2';
	export let rounded = 'rounded';
	export let meter = 'bg-green-500';
	export let track = 'bg-gray-200';
	export let labelledby: string | undefined = undefined;
</script>

<div class="relative pt-1">
	<div
		class={`overflow-hidden ${height} mb-4 text-xs flex ${rounded} ${track}`}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		aria-labelledby={labelledby}
		role="progressbar"
	>
		{#if value !== undefined}
			<div
				style={`width: ${((value - min) / (max - min)) * 100}%`}
				class={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${meter}`}
			/>
		{/if}
	</div>
</div>
