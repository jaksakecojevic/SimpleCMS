import widgets from '../components/widgets';

// typesafe-i18n
import LL from '@src/i18n/i18n-svelte';
import { get } from 'svelte/store';

let schema = {
	// Collection Name required
	name: 'widget-test',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:card-text',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Text({
			db_fieldName: 'First',
			label: get(LL).COLLECTION_TEST_First(),
			icon: 'ri:t-box-line',
			placeholder: get(LL).COLLECTION_TEST_First_placeholder(),
			required: true,
			width: '33%'
		}),

		widgets.Text({
			db_fieldName: 'Middle',
			label: get(LL).COLLECTION_TEST_Middle(),
			icon: 'ri:t-box-line',
			placeholder: get(LL).COLLECTION_TEST_Middle_placeholder(),
			required: false,
			readonly: true,
			width: '13%'
		}),

		widgets.Text({
			db_fieldName: 'Last',
			label: get(LL).COLLECTION_TEST_Last(),
			icon: 'ri:t-box-line',
			placeholder: get(LL).COLLECTION_TEST_Last_placeholder(),
			required: true,
			width: '53%',
			localization: true,
			disabled: true
		}),

		widgets.Text({
			db_fieldName: 'Full Text option',
			label: get(LL).COLLECTION_TEST_Full_Text_Option(),
			icon: 'carbon:character-whole-number',
			// prefix: '€',
			suffix: 'cent',
			count: 10,
			minlength: 2,
			maxlength: 15,
			placeholder: get(LL).COLLECTION_TEST_Full_Text_Option_Placeholder(),
			localization: true,
			required: true
		})

		// widgets.Email({
		// 	db_fieldName: 'Email',
		// 	icon: 'carbon:character-whole-number',
		// 	placeholder: 'Enter Email',
		// 	required: true
		// })
	]
};
export default schema;