<script lang="ts">
	import { collection } from '@src/collections';
	import { collectionValue, language } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	import { PUBLIC_TRANSLATIONS } from '$env/static/public';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	export let fields: typeof $collection.fields | undefined = undefined;

	let asAny = (value: any) => value;

	export let root = true; // if Fields is not part of any widget.
	export let fieldsData = {};

	$: if (root) $collectionValue = fieldsData;
</script>

<div class="container text-white">
	{#each fields || $collection.fields as field, index}
		{#if field.widget}
			{#key $collection}
				<div>
					<!-- db_fieldName or label  -->
					<!-- TODO: Get translated Name -->
					<div class="relative flex">
						<p class="font-semibold">
							{#if field.label}
								{field.label}
							{:else}
								{field.db_fieldName}
							{/if}
							<!-- TODO:fix other fields -->
							{#if field.widget.name}
								<span class="ml-1 pb-3 text-red-500">*</span>
							{/if}
						</p>

						<!-- <div class="absolute right-0 flex gap-4">
							{#if field.localization}
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
						</div> -->
					</div>

					<!-- display all widget fields -->
					<svelte:component this={asAny(field.widget)} field={asAny(field)} bind:fieldData={fieldsData[getFieldName(field)]} {...$$props} />
				</div>
			{/key}
		{/if}
	{/each}
</div>

<style lang="postcss">
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
</style>
