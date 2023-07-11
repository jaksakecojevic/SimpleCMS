import PhoneNumber from './PhoneNumber.svelte';
import { GuiSchema, type Params } from './types';

import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';

const widget = ({
	label,
	db_fieldName,
	display,
	translated = false, // default no translation
	icon,
	// extras
	placeholder,
	count,
	minlength,
	maxlength,
	pattern,
	size,
	required,
	readonly,
	width
}: Params) => {
	if (!display) {
		// display for table
		display = async (data, field, entry, contentLanguage) => {
			//console.log(data);
			data = data ? data : {}; // data can only be undefined if entry exists in db but this field was not set.
			return translated ? data[contentLanguage] || 'NO entry' : data[PUBLIC_CONTENT_LANGUAGES] || 'NO entry';
		};
	}

	let widget: { type: any; key: 'PhoneNumber' } = { type: PhoneNumber, key: 'PhoneNumber' };

	let field = {
		display,
		schema: { [db_fieldName || label]: { String: String } },
		label,
		db_fieldName,
		translated,
		icon,
		// extras
		placeholder,
		count,
		minlength,
		maxlength,
		pattern,
		size,
		required,
		readonly,
		width
	};

	return { ...field, widget };
};

widget.GuiSchema = GuiSchema;

export interface FieldType extends ReturnType<typeof widget> {}
export default widget;
