<script lang="ts">
	import { collectionValue, mode } from '@src/stores/store';
	import { credentials } from '@src/stores/load';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import Fields from '@src/components/Fields.svelte';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import { collection } from '@src/collections';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
	//console.log(data);
	credentials.set(data.credentials);

	collection.subscribe((value) => {
		$collectionValue = {};
	});
</script>

<div class="flex">
	<Drawer />
	<div class="max-h-screen flex-grow overflow-auto">
		{#if $mode == 'view' || $mode == 'delete'}
			<EntryList />
		{:else if ['edit', 'create'].includes($mode)}
			<Fields />
		{/if}
	</div>
	<!-- TODO: add Top & Footer Drawers -->
	<div class="hidden md:block">
		<ControlPanel />
	</div>
	<!--mobile Drawers-->
	<!-- <div class="block md:hidden">Top Drawer</div>
	<div class="block md:hidden">Footer Drawer</div> -->
</div>
