<script lang="ts">
	import { categories } from '@src/collections';
	import { collection } from '@src/collections';
	import { mode } from '@src/stores/store';

	export let switchSideBar = true;

	let expanded: any = {};

	function setHeight(node: HTMLDivElement) {
		let height = node.clientHeight;
		node.style.setProperty('--height', (height <= 300 ? height : 300) + 'px');
		node.style.maxHeight = '0px';
		node.style.transition = ' 0.5s';
	}
</script>

{#each categories as category, index}
	<!-- Collection Partents -->

	<div
		class="relative mb-1 h-[40px] cursor-pointer overflow-visible rounded-sm bg-[#363b4e] py-2 text-center text-white"
		class:arrow_up={expanded[index]}
		on:click={(e) => {
			expanded[index] = !expanded[index];
		}}
	>
		{#if switchSideBar}
			<div class="flex items-center">
				<iconify-icon icon={category.icon} width="24" class="px-2 text-red-600" />

				<p class="uppercase">{category.name}</p>
			</div>
		{:else}<div class="flex items-center">
				<iconify-icon icon={category.icon} width="24" class="px-2 text-red-600" />
			</div>
		{/if}
	</div>

	<!-- Collection Childern -->
	<div class:expand={expanded[index]} use:setHeight class="overflow-hidden">
		{#each category.collections as _collection}
			<div
				class="border-surface-200 dark:bg-surface-400 relative flex h-[40px] cursor-pointer items-center justify-center border-b bg-[#777a89] p-0 text-center capitalize text-white last:mb-1 last:border-b-0 hover:bg-[#65dfff] hover:text-white dark:text-white dark:hover:bg-[#65dfff] dark:hover:text-white"
				on:click={(e) => {
					mode.set('view');
					$collection = _collection;
				}}
			>
				<div class="flex items-center">
					<iconify-icon icon={_collection.icon} width="24" class="px-2 text-red-600" />

					<p class="capitalize">{_collection.name}</p>
				</div>
			</div>
		{/each}
	</div>
{/each}

<style lang="postcss">
	.expand {
		max-height: var(--height) !important;
	}
	.arrow::after {
		content: '';
		position: absolute;
		right: 0;
		top: 40%;
		transform: translateY(-50%);
		border: solid white;
		border-width: 0 3px 3px 0;
		display: inline-block;
		padding: 3px;
		transform: rotate(45deg);
		margin-right: 10px;
		transition: transform 0.1s ease-in;
	}

	.arrow_up::after {
		transform: rotate(225deg);
	}
</style>
