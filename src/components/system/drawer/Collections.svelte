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
	{#if !switchSideBar}
		<div
			class="arrow tooltip_right relative mb-1 h-[40px] cursor-pointer overflow-visible rounded-sm bg-surface-600 py-2 text-center bg-[#363b4e] text-white"
			class:arrow_up={expanded[index]}
			on:click={(e) => {
				expanded[index] = !expanded[index];
			}}
		>
			<div class="flex items-center">
				<iconify-icon icon={category.icon} width="24" class="px-2 text-red-600" />

				<p class="uppercase">{category.name}</p>
			</div>
		</div>
	{:else}
		<div class="flex items-center">
			<iconify-icon icon={category.icon} width="24" class="px-2 text-red-600" />
		</div>
	{/if}

	<!-- Collection Childern -->
	<div class:expand={expanded[index]} use:setHeight class="overflow-hidden">
		{#each category.collections as _collection}
			<p
				class="relative cursor-pointer border-b border-surface-200 bg-[#777a89] p-0 text-center text-white last:mb-1 last:border-b-0 hover:bg-[#65dfff] hover:text-white dark:bg-surface-400 dark:text-white dark:hover:bg-[#65dfff] dark:hover:text-white flex h-[40px] items-center justify-center capitalize"
				on:click={(e) => {
					mode.set('view');
					$collection = _collection;
				}}
			>
				{_collection.name}
			</p>
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
