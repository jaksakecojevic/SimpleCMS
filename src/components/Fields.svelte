<script lang="ts">
	import { mode } from '@src/stores/store';
	import { categories } from '@src/collections';
	import { collection } from '@src/collections';
	import { collectionValue, language } from '@src/stores/store';
	import { cloneData, deleteData, getFieldName, handleCancel } from '@src/utils/utils';

	import AnimatedHamburger from '@src/components/AnimatedHamburger.svelte';
	import Button from './system/buttons/Button.svelte';

	export let switchSideBar = false;
	import { toggleLeftSidebar } from '@src/stores/store';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';
	import { PUBLIC_TRANSLATIONS } from '$env/static/public';

	export let fields: typeof $collection.fields | undefined = undefined;

	let asAny = (value: any) => value;

	export let root = true; // if Fields is not part of any widget.
	export let fieldsData = {};

	$: if (root) $collectionValue = fieldsData;
</script>

<div class="container text-white">
	<header class="bg-gray-800 flex justify-between items-center border-b relative w-full p-2">
		<div class="flex justify-start items-center">
			{#if !switchSideBar && $toggleLeftSidebar}
				<AnimatedHamburger width="40" />
			{/if}
			<!-- Collection type with icon -->

			<div class="flex flex-col mr-1 {!$toggleLeftSidebar ? 'ml-2' : ''}">
				{#if categories}
					<div class="mb-2 text-xs capitalize text-gray-400 dark:text-gray-300">
						{categories[0].name}
					</div>
				{/if}
				<div class="-mt-2 flex justify-start text-sm font-bold dark:text-white lg:text-xl md:text-2xl">
					{#if $collection.icon}
						<span><iconify-icon icon={$collection.icon} width="24" class="mr-1 sm:mr-2 text-red-500" /></span>
					{/if}
					{#if $collection.name || $mode}
						<div class="flex -mt-1">
							<span class="capitalize">{$mode}:</span>
							<span class="ml-1 uppercase">{$collection.name}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex justify-end items-center gap-4">
			<Button on:click={deleteData} iconLeft="icomoon-free:bin" backgroundColor="red" btnClass="circular-btn w-10 h-10 !p-0" />
			<Button on:click={cloneData} iconLeft="fa-solid:clone" backgroundColor="orange" btnClass="circular-btn w-10 h-10 !p-0" />
			<select class="rounded bg-gray-600 text-white">
				<option value="EN">EN</option>
			</select>
			<Button on:click={handleCancel} iconLeft="material-symbols:close" btnClass="circular-btn w-10 h-10 !p-0" />
		</div>
	</header>

	<main>
		{#each fields || $collection.fields as field, index}
			{#if field.widget}
				{#key $collection}
					<div class="">
						<!-- db_fieldName or label  -->
						<!-- TODO: Get translated Name -->
						<div class="relative flex">
							<p class="font-semibold capitalize">
								{#if field.label}
									{field.label}
								{:else}
									{field.db_fieldName}
								{/if}
								<!-- TODO:fix other fields -->
								{#if $collection.fields}
									<span class="ml-1 pb-3 text-red-500">*</span>
								{/if}
							</p>

							<div class="absolute right-0 flex gap-4">
								{#if $collection.localization}
									<div class="flex items-center gap-1 px-2">
										<iconify-icon icon="bi:translate" color="dark" width="18" class="text-sm" />
										<div class="text-xs font-normal text-red-500">
											{JSON.parse(PUBLIC_TRANSLATIONS)[$language]}
										</div>
									</div>
								{/if}
								{#if field.icon}
									<iconify-icon icon={field.icon} color="dark" width="22" class="w-10" />
								{:else}
									<div class="w-[40px]" />
								{/if}
							</div>
						</div>

						<!-- display all widget fields -->
						<svelte:component this={asAny(field.widget)} field={asAny(field)} bind:fieldData={fieldsData[getFieldName(field)]} {...$$props} />
					</div>
				{/key}
			{/if}
		{/each}
	</main>
</div>

<style lang="postcss">
	.container {
		display: flex;
		align-items: center;
		justify-content: start;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	main {
		margin-top: 80px;
	}
</style>
