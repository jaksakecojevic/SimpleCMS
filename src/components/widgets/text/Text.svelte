<script lang="ts">
	import type { FieldType } from './';

	import Input from '@src/components/system/inputs/input.svelte';
	import { mode, entryData } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	export let field: FieldType | undefined;
	let fieldName = getFieldName(field);

	let _data: { [key: string]: string } = $mode == 'create' ? {} : $entryData[fieldName];
	export const fieldData = async () => _data;
</script>

<Input type="text" bind:value={_data['en']} />
