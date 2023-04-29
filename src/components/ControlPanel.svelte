<script lang="ts">
	import Button from './system/buttons/Button.svelte';
	import { categories } from '@src/collections';
	import { collection } from '@src/collections';
	import { collectionValue, mode } from '@src/stores/store';
	import { saveFormData } from '@src/utils/utils';

	async function saveData() {
		await saveFormData({ data: $collectionValue });
		mode.set('view');
	}
</script>

<!-- Mobile Top Sidebar -->
<!-- <div class="container-top">
	Top Sidebar
 {#if $mode == 'view'}
		<Button on:click={() => mode.set('create')}>Create</Button>
	{:else if ['edit', 'create'].includes($mode)}
		<header>
					<Button on:click={saveData} btnClass="w-full">Save</Button>
		</header>
	{/if}
</div> -->
<!-- Mobile Footer Sidebar -->

<!-- <div class="container-footer">
	Footer Sidebar
	{#if ['edit', 'create'].includes($mode)}
		<footer class="text-white">
			<h2 class="font-bold text-center">Content Info:</h2>
			<div class="footer-content">
				<div><span>Created:</span><span>16.04.2023</span></div>
				<div><span>Updated:</span><span>17.04.2023</span></div>
				<div><span>Revisions:</span><span>2</span></div>
			</div>
		</footer>
	{/if}
</div> -->

<!-- Desktop Right Sidebar -->
<div class="container pt-2 bg-gray-800">
	{#if $mode == ['view']}
		<Button on:click={() => mode.set('create')}>Create</Button>
	{:else if ['edit', 'create'].includes($mode)}
		<header class="mx-2 text-red-500">
			<Button on:click={saveData} backgroundColor="green" iconLeft="material-symbols:save" btnClass="w-full font-bold uppercase">
				Save {$collection.name}
			</Button>
		</header>
		<main class="text-white">
			<h2 class="font-bold">Admin Widget Area:</h2>
			{#if collectionValue.name}<p>Seo {collectionValue.name} widget</p>{/if}
		</main>
		<footer class="text-white">
			<h2 class="font-bold text-center">Content Info:</h2>
			<div class="footer-content text-sm">
				<!-- TODO: Use real dates & revision -->
				{#if $collection.status}
					<div class="text-red-500 mb-2"><span>Status:</span><span class="uppercase">{$collection.status}</span></div>
				{/if}
				<div><span>Created:</span><span>{$collection.created}</span></div>
				<div><span>Updated:</span><span>{$collection.updated}</span></div>
				<div><span>Revisions:</span><span>{$collection.revision}</span></div>
			</div>
		</footer>
	{/if}
</div>

<style lang="postcss">
	.container {
		display: flex;
		flex-direction: column;
		width: 200px;
		height: 100vh;
	}

	/* .container-top {
		display: block;
		width: 100%;
		height: 150px;
		background-color: red;
	}

	.container-footer {
		display: block;
		width: 100%;
		height: 100px;
		background-color: yellow;
	} */

	header {
		flex: 0 0 auto;
		text-align: center;
	}
	main {
		flex: 1 1 auto;
		align-items: center;
		text-align: center;
		justify-content: flex-start;
		padding: 1rem 0.5rem;
	}
	footer {
		flex: 0 0 auto;
		padding: 0 0.5rem 1.5rem;
	}
	.footer-content > div {
		display: flex;
		justify-content: space-between;
	}
	.footer-content > div > span:first-child {
		margin-right: 1rem;
	}
</style>
