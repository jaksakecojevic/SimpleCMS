import widgets from '../components/widgets';
let schema = {
	// Collection Name required
	name: 'posts2',
	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:card-text',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Text({
			label: 'First Name',
			icon: 'ri:t-box-line',
			placeholder: 'Enter First Name'
		}),
		widgets.Text({
			label: 'Last Name',
			icon: 'ri:t-box-line'
		})
	]
};
export default schema;
