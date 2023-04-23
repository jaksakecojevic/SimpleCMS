// ImageArray - allows multiple image upload with editor
import type { Params as ImageUpload_Params } from '../imageUpload/types';
import { getFieldName } from '@src/utils/utils.js';
import type { Params } from './types';
import ImageArray from './ImageArray.svelte';
let widget = ({
	// Accept parameters from collection
	db_fieldName,

	icon,
	fields,
	required,
	label,
	display
}: Params) => {
	let uploader = fields[0] as ImageUpload_Params;
	if (!display)
		display = async (data: any, field: any, entry: any) =>
			`<img class='max-w-[200px] inline-block' src="${uploader.path}/${entry[getFieldName(uploader)].name}" />`;

	let field = {
		widget: ImageArray,
		schema: { [db_fieldName || label]: { String: String } },
		db_fieldName,
		label,
		icon,
		upload: true,
		fields,
		required,
		display
	};

	return field;
};
export interface FieldType extends ReturnType<typeof widget> {}
export default widget;