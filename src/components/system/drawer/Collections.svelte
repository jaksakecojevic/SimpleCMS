<script lang="ts">
	import { collection, categories } from '@src/collections';
	import { mode, switchSideBar } from '@src/stores/store';
	import Tooltip from '@src/components/system/tooltip/Tooltip.svelte';

	let expanded: any = {};

	function setHeight(node: HTMLDivElement) {
		let height = node.clientHeight;
		node.style.setProperty('--height', (height <= 300 ? height : 300) + 'px');
		node.style.maxHeight = '0px';
		node.style.transition = ' 0.5s';
	}
</script>
<!-- display all collection parents and their Children as dropdown -->
{#each categories as category, index}

	<!-- Collection Partents -->
	<div
		class="relative mb-1 h-[40px] cursor-pointer overflow-visible rounded-sm bg-[#363b4e] py-2 text-white"
		class:arrow_up={expanded[index]}
		on:click={(e) => {
			expanded[index] = !expanded[index];
		}}
	>
		<div class="flex" class:justify-start={$switchSideBar}>
			{#if $switchSideBar}
				<iconify-icon icon={category.icon} width="24" class="px-2 text-red-600" />
				<p class="uppercase">{category.name}</p>
			{:else}
			<Tooltip  text={category.name} position="right" active={!$switchSideBar} />
				<iconify-icon icon={category.icon} width="24" class="px-2 text-red-600" />
			{/if}
		</div>
	</div>

	<!-- Collection Children -->
	<div class:expand={expanded[index]} use:setHeight class="overflow-hidden">
		{#each category.collections as _collection}
			<div
				class="{$switchSideBar
					? 'h-[40px]'
					: 'h-fit'} border-gray-200 w-full dark:bg-gray-400 relative flex justify-start cursor-pointer border-b bg-[#777a89] text-center capitalize text-white last:mb-1 last:border-b-0 hover:bg-[#65dfff] hover:text-white dark:text-white dark:hover:bg-[#65dfff] dark:hover:text-white"
				on:click={(e) => {
					mode.set('view');
					$collection = _collection;
				}}
			>
				{#if $switchSideBar}
					<!-- switchSideBar expanded -->
					<div class="flex flex-row items-center justify-start pl-4">
						<iconify-icon icon={_collection.icon} width="24" class="px-2 text-red-600" />
						<p class="mr-auto text-center capitalize">{_collection.name}</p>
					</div>
				{:else}
					<!-- switchSideBar collapsed -->
					<div class="flex flex-col items-center justify-start pl-4">
						<p class="text-center text-xs capitalize">{_collection.name}</p>
						<iconify-icon icon={_collection.icon} width="24" class="mt-2 px-2 text-red-600" />
					</div>
				{/if}
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
