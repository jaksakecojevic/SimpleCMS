<script lang="ts">
	import axios from 'axios';
	import Button from './system/buttons/Button.svelte';
	import { collectionValue, mode } from '@src/stores/store';
	import { collection } from '@src/stores/load';
	import { config, obj2formData } from '@src/utils/utils';
	import { entryValue } from '@src/stores/widgetStore';

	async function saveData() {
		let formData = obj2formData($collectionValue);
		switch ($mode) {
			case 'create':
				await axios.post(`/api/${$collection.name}`, formData, config);
				break;
			case 'edit':
				formData.append('_id', $entryValue._id);
				await axios.patch(`/api/${$collection.name}`, formData, config);
				break;
		}
		mode.set('view');
	}
</script>

<div class="container pt-2">
	{#if $mode == 'view'}
		<Button on:click={() => mode.set('create')}>Create</Button>
	{:else if ['edit', 'create'].includes($mode)}
		<header>
			<!-- TODO: add margin to button -->
			<Button on:click={saveData} btnClass="w-full">Save</Button>
		</header>
		<main class="text-white">
			<h2 class="font-bold">Widget Area:</h2>
			<p>Seo widget</p>
		</main>
		<footer class="text-white">
			<h2 class="font-bold text-center">Content Info:</h2>
			<div class="footer-content">
				<!-- TODO: Use real dates & revision -->
				<div><span>Created:</span><span>16.04.2023</span></div>
				<div><span>Updated:</span><span>17.04.2023</span></div>
				<div><span>Revisions:</span><span>2</span></div>
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
		background-color: #242734;
	}
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
