<script lang="ts">
	export let text = '';
	export let color = 'gray';
	export let width = 'w-auto';
</script>

<span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[8px] font-medium bg-${color}-100 text-${color}-800 ${width}`}>
	{text}
</span>

<style>
	.bg-primary-100 {
		@apply bg-green-300;
	}
	.text-primary-800 {
		@apply text-green-800;
	}
</style>
