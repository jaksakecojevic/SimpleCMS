<script lang="ts">
	import { categories } from '@src/collections';
	import { collection } from '@src/collections';
	import { mode, entryData, toggleLeftSidebar } from '@src/stores/store';
	import axios from 'axios';
	import { writable } from 'svelte/store';

	export let switchSideBar = false;
	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	let searchShow = false;
	let columnShow = false;
	let filterShow = false;
	let spacingShow = false;

	import {
		createSvelteTable,
		flexRender as flexRenderBugged,
		getCoreRowModel,
		getSortedRowModel,
		getPaginationRowModel
	} from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions, SortDirection, FilterFn } from '@tanstack/table-core/src/types';
	import Button from './system/buttons/Button.svelte';
	import AnimatedHamburger from './AnimatedHamburger.svelte';

	let data: { entryList: [any]; totalCount: number } | undefined;
	let tableData: any = [];
	let sorting: any = [];
	let columnOrder: never[] = [];
	let columnVisibility = {};
	let globalFilter = '';

	let refresh = async (collection: typeof $collection) => {
		data = undefined;
		data = (await axios.get(`/api/${$collection.name}?page=${1}&length=${50}`).then((data) => data.data)) as { entryList: [any]; totalCount: number };
		tableData = await Promise.all(
			data.entryList.map(async (entry) => {
				let obj: { [key: string]: any } = {};
				for (let field of collection.fields) {
					obj[field.label] = await field.display(entry[field.label]?.en || entry[field.label], field, entry);
				}
				return obj;
			})
		);
		options.update((options) => ({
			...options,
			data: tableData,
			columns: $collection.fields.map((field) => ({
				accessorKey: field.label
			}))
		}));
	};

	const setSorting = (updater: (arg0: any) => any) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				sorting
			}
		}));
	};

	const setColumnOrder = (updater: any) => {
		if (updater instanceof Function) {
			columnOrder = updater(columnOrder);
		} else {
			columnOrder = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				columnOrder
			}
		}));
	};

	const setColumnVisibility = (updater: any) => {
		if (updater instanceof Function) {
			columnVisibility = updater(columnVisibility);
		} else {
			columnVisibility = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				columnVisibility
			}
		}));
	};

	const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
		// // Rank the item
		// const itemRank = rankItem(row.getValue(columnId), value);
		// // Store the itemRank info
		// addMeta({
		// 	itemRank
		// });
		// // Return if the item should be filtered in/out
		// return itemRank.passed;
	};

	const globalFilterFn: FilterFn<any> = (row, columnId, value, addMeta) => {
		// if (Array.isArray(value)) {
		// 	if (value.length === 0) return true;
		// 	return value.includes(row.getValue(columnId));
		// }
		// // Rank the item
		// const itemRank = rankItem(row.getValue(columnId), value);
		// // Store the itemRank info
		// addMeta({
		// 	itemRank
		// });
		// // Return if the item should be filtered in/out
		// return itemRank.passed;
	};

	function setCurrentPage(page: number) {
		options.update((old: any) => {
			return {
				...old,
				state: {
					...old.state,
					pagination: {
						...old.state?.pagination,
						pageIndex: page
					}
				}
			};
		});
	}

	function setPageSize(e: Event) {
		const target = e.target as HTMLInputElement;
		options.update((old: any) => {
			return {
				...old,
				state: {
					...old.state,
					pagination: {
						...old.state?.pagination,
						pageSize: parseInt(target.value)
					}
				}
			};
		});
	}

	function handleCurrPageInput(e: Event) {
		const target = e.target as HTMLInputElement;
		setCurrentPage(parseInt(target.value) - 1);
	}

	$: refresh($collection);
	const options = writable<TableOptions<any>>({
		data: tableData,
		columns: $collection.fields.map((field) => ({
			accessorKey: field.label
		})),
		filterFns: {
			fuzzy: fuzzyFilter
		},
		state: {
			sorting,
			columnOrder,
			globalFilter
		},

		onSortingChange: setSorting,
		globalFilterFn: globalFilterFn,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnOrderChange: setColumnOrder,
		ColumnVisibilityChange: setColumnVisibility
	});

	$: table = createSvelteTable(options);

	//workaround for svelte-table bug
	let flexRender = flexRenderBugged as (...args: Parameters<typeof flexRenderBugged>) => any;
</script>

<div class="text-white my-2 mr-2 flex justify-between items-center">
	<div class="flex items-center">
		{#if !switchSideBar && $toggleLeftSidebar}
			<AnimatedHamburger width="40" />
		{/if}
		<!-- Collection type with icon -->
		<div class="flex flex-col mr-1 {!$toggleLeftSidebar ? 'ml-2' : ''}">
			{#if categories}<div class="mb-2 text-xs capitalize text-surface-500 dark:text-surface-300">
					{categories[0].name}
				</div>{/if}
			<div class="-mt-2 flex justify-start text-sm font-bold uppercase dark:text-white lg:text-xl md:text-2xl">
				{#if $collection.icon}<span> <iconify-icon icon={$collection.icon} width="24" class="mr-1 sm:mr-2 text-red-500" /></span>{/if}
				{#if $collection.name}
					<div class="flex max-w-[65px] sm:max-w-none leading-3 xs:mt-1 md:mt-0 sm:mr-2 md:leading-none whitespace-normal">
						{$collection.name}
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="buttons">
		<!-- Search -->
		<Button btnClass="circular-btn w-10 h-10 !p-0" iconLeft="material-symbols:search-rounded" on:click={() => (searchShow = !searchShow)} />

		<!-- Filter -->
		<Button iconLeft="material-symbols:filter-list-rounded" on:click={() => (filterShow = !filterShow)} />

		<!-- Column Order & Visility -->
		<!-- Column Order/ Sort-->
		<Button iconLeft="fluent:column-triple-edit-24-regular" iconRight="mdi:chevron-down" on:click={() => (columnShow = !columnShow)}>
			<!-- {$LL.TANSTACK_Column()} -->
		</Button>

		<!-- Spacing -->
		<Button iconLeft="material-symbols:align-space-even-rounded" on:click={() => (spacingShow = !spacingShow)} />

		<!-- MultiButton -->
		<Button on:click={() => mode.set('create')} iconLeft="ic:outline-plus">Create</Button>
	</div>
</div>
{#if columnShow}
	<div class="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-center dark:text-white">
		<!-- toggle all -->
		<div class="flex items-center mb-2 md:mb-0 md:mr-4">
			<label>
				<input
					checked={$table.getIsAllColumnsVisible()}
					on:change={(e) => {
						console.info($table.getToggleAllColumnsVisibilityHandler()(e));
					}}
					type="checkbox"
				/>{' '}
				{$LL.TANSTACK_Toggle()}
			</label>

			<!-- Show/hide Columns via chips -->
			<div class="flex flex-wrap items-center justify-center">
				{#each $table.getAllLeafColumns() as column}
					<span
						class="chip {column.getIsVisible() ? 'variant-filled-secondary' : 'variant-ghost-secondary'} mx-2 my-1"
						on:click={column.getToggleVisibilityHandler()}
						on:keypress
					>
						{#if column.getIsVisible()}<span><iconify-icon icon="fa:check" /></span>{/if}
						<span class="capitalize">{column.id}</span>
					</span>
				{/each}
			</div>
		</div>
	</div>
{/if}

<!-- Tanstack Table -->
<table>
	<thead>
		{#each $table.getHeaderGroups() as headerGroup}
			<tr class="divide-x capitalize">
				{#each headerGroup.headers as header}
					<th>
						{#if !header.isPlaceholder}
							<div
								class:cursor-pointer={header.column.getCanSort()}
								class:select-none={header.column.getCanSort()}
								on:click={header.column.getToggleSortingHandler()}
							>
								<svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />
								{#if header.column.getIsSorted() === 'asc'}
									<iconify-icon icon="material-symbols:arrow-upward-rounded" width="16" />
								{:else if header.column.getIsSorted() === 'desc'}
									<iconify-icon icon="material-symbols:arrow-downward-rounded" width="16" />
								{/if}
							</div>
						{/if}
					</th>
				{/each}
			</tr>
		{/each}
	</thead>
	<tbody>
		{#each $table.getRowModel().rows as row, index}
			<tr
				class="divide-x"
				on:click={() => {
					entryData.set(data?.entryList[index]);
					mode.set('edit');
				}}
			>
				{#each row.getVisibleCells() as cell}
					<td>
						{@html cell.getValue()}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
	<tfoot>
		{#each $table.getFooterGroups() as footerGroup}
			<tr>
				{#each footerGroup.headers as header}
					<th>
						{#if !header.isPlaceholder}
							<svelte:component this={flexRender(header.column.columnDef.footer, header.getContext())} />
						{/if}
					</th>
				{/each}
			</tr>
		{/each}
	</tfoot>
</table>

<!-- Pagination -->
<div class="flex justify-around items-center my-3 text-gray-400">
	<!-- show & count rows -->
	<div class="hidden md:block text-surface-400 text-sm">
		{$LL.TANSTACK_Page()}
		<span class="text-surface-700 dark:text-white">{$table.getState().pagination.pageIndex + 1}</span>
		{$LL.TANSTACK_of()}
		<!-- TODO: Get actual pages -->
		<!-- <span class="text-surface-700 dark:text-white">{$table.getState().pagination.pageCount}</span> -->
		<span class="text-surface-700 dark:text-white"
			>{Math.ceil($table.getPrePaginationRowModel().rows.length / $table.getState().pagination.pageSize)}</span
		>
		- (<span class="text-surface-700 dark:text-white">{$table.getPrePaginationRowModel().rows.length}</span>
		{$LL.TANSTACK_Total()}

		{#if $table.getPrePaginationRowModel().rows.length === 1}
			{$LL.TANSTACK_Row()})
		{:else}
			{$LL.TANSTACK_Rows()}){/if}
	</div>

	<!-- number of pages -->
	<select
		value={$table.getState().pagination.pageSize}
		on:change={setPageSize}
		class="hidden dark:text-white rounded py-2 dark:bg-gray-800 sm:block max-w-[100px] select text-sm"
	>
		{#each [10, 25, 50, 100, 500] as pageSize}
			<option value={pageSize}>
				{pageSize} Rows
			</option>
		{/each}
	</select>

	<!-- next/previous pages -->
	<div class="inline-flex transition duration-150 ease-in-out mt-2">
		<button
			class=""
			aria-label="Go to First Page"
			on:click={() => setCurrentPage(0)}
			class:is-disabled={!$table.getCanPreviousPage()}
			disabled={!$table.getCanPreviousPage()}
		>
			<iconify-icon icon="material-symbols:first-page" width="24" />
		</button>

		<button
			class=""
			aria-label="Go to Previous Page"
			on:click={() => setCurrentPage($table.getState().pagination.pageIndex - 1)}
			class:is-disabled={!$table.getCanPreviousPage()}
			disabled={!$table.getCanPreviousPage()}
		>
			<iconify-icon icon="material-symbols:chevron-left" width="24" />
		</button>

		<!-- input display -->
		<div class="text-sm mb-2">
			<span> {$LL.TANSTACK_Page()} </span>

			<input
				type="number"
				value={$table.getState().pagination.pageIndex + 1}
				min={0}
				max={$table.getPageCount() - 1}
				on:change={handleCurrPageInput}
				class=" input dark:text-white dark:bg-gray-800 py-[5px] border rounded w-14"
			/>
			<span>
				{' '}{$LL.TANSTACK_of()}{' '}
				<span class="dark:text-white">{$table.getPageCount()}</span>
			</span>
		</div>

		<button
			aria-label="Go to Next Page"
			on:click={() => setCurrentPage($table.getState().pagination.pageIndex + 1)}
			class:is-disabled={!$table.getCanNextPage()}
			disabled={!$table.getCanNextPage()}
		>
			<iconify-icon icon="material-symbols:chevron-right" width="24" />
		</button>
		<button
			aria-label="Go to Last Page"
			on:click={() => setCurrentPage($table.getPageCount() - 1)}
			class:is-disabled={!$table.getCanNextPage()}
			disabled={!$table.getCanNextPage()}
		>
			<iconify-icon icon="material-symbols:last-page" width="24" />
		</button>
	</div>
</div>
<div class="md:hidden flex flex-col justify-center items-center gap-2">
	<!-- number of pages -->
	<select value={$table.getState().pagination.pageSize} on:change={setPageSize} class="sm:hidden max-w-[100px] select text-sm">
		{#each [10, 25, 50, 100, 500] as pageSize}
			<option value={pageSize}>
				{pageSize}
				{$LL.TANSTACK_Rows()}
			</option>
		{/each}
	</select>

	<!-- Pagination -->
	<div class="text-gray-400 text-sm">
		{$LL.TANSTACK_Show()}
		<span class="text-gray-700 dark:text-white">{$table.getState().pagination.pageIndex + 1}</span>
		{$LL.TANSTACK_of()}
		<!-- TODO: Get actual page -->
		<!-- <span class="text-surface-700 dark:text-white"
				>{$table.getState().pagination.pageIndex + 1}</span
			> -->
		<span class="text-gray-700 dark:text-white"
			>{Math.ceil($table.getPrePaginationRowModel().rows.length / $table.getState().pagination.pageSize)}</span
		>
		- (<span class="text-gray-700 dark:text-white">{$table.getPrePaginationRowModel().rows.length}</span>
		{$LL.TANSTACK_Total()}

		{#if $table.getPrePaginationRowModel().rows.length === 1}
			{$LL.TANSTACK_Row()})
		{:else}
			{$LL.TANSTACK_Rows()}){/if}
	</div>
</div>

<style lang="postcss">
	th,
	td {
		min-width: 120px;
		text-align: center;
		cursor: pointer;
	}
	thead th:first-of-type {
		border-top-left-radius: 3px;
	}
	thead th:last-of-type {
		border-top-right-radius: 3px;
	}
	tbody tr:last-of-type td:first-of-type {
		border-bottom-left-radius: 3px;
	}
	tbody tr:last-of-type td:last-of-type {
		border-bottom-right-radius: 3px;
	}
	thead th,
	td {
		padding: 5px 0;
	}
	tbody tr:nth-child(2n + 1) {
		padding: 5px 0;
		background-color: #283847;
	}
	table {
		min-width: calc(100% - 10px);
		margin: auto;
		color: white;
	}
	thead {
		position: sticky;
		top: 0;
		background-color: #3d4a5c;
		font-size: 16px;
	}
	tbody {
		background-color: #202832;
		font-size: 14px;
	}
	tbody tr:hover {
		background-color: #274b6f;
	}
</style>
