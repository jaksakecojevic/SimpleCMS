<script lang="ts">
	import axios from 'axios';
	import type { FieldType } from './';
	import { entryData, mode } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	import Input from '@src/components/system/inputs/input.svelte';

	export let field: FieldType | undefined;

	let _data: FileList;

	export const fieldData = async () => _data;
	export let file: File | undefined = undefined; // pass file directly from imageArray
	// console.log(file);

	let fieldName = getFieldName(field);

	function setFile(node: HTMLInputElement) {
		node.onchange = (e) => (_data = (e.target as HTMLInputElement).files as FileList);
		if (file instanceof File) {
			let fileList = new DataTransfer();
			fileList.items.add(file);
			_data = node.files = fileList.files;
		} else if ($mode === 'edit') {
			axios.get(`${field?.path}/${$entryData[fieldName].name}`, { responseType: 'blob' }).then(({ data }) => {
				let fileList = new DataTransfer();
				let file = new File([data], $entryData[fieldName].name, {
					type: $entryData[fieldName].mimetype
				});
				fileList.items.add(file);
				_data = node.files = fileList.files;
			});
		}
	}
</script>

<!-- <Input
	name={fieldName}
	labelClass="hidden"
	inputClass="w-full cursor-pointer rounded-lg border border-surface-300 bg-surface-50 text-sm text-surface-900 focus:outline-none dark:border-surface-600 dark:bg-surface-700 dark:text-surface-400 dark:placeholder-surface-400"
	type="file"
/> -->

<input
	use:setFile
	name={fieldName}
	class="border-surface-300 bg-surface-50 text-surface-900 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-400 dark:placeholder-surface-400 w-full cursor-pointer rounded-lg border text-sm focus:outline-none"
	type="file"
/>

{#if _data}
	<img src={URL.createObjectURL(_data[0])} alt="" />
{/if}

<style lang="postcss">
	img {
		max-width: 600px;
		max-height: 200px;
		margin: auto;
		margin-top: 10px;
	}
</style>
