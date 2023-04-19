<script lang="ts">
	export let header: string;
	export let footer: string;
	export let variant: string;
</script>

<div class={`card ${variant ? `variant-glass-${variant}` : ''}`}>
	{#if header}
		<div class="card-header">{header}</div>
	{/if}
	<slot />
	{#if footer}
		<div class="card-footer">{footer}</div>
	{/if}
</div>
