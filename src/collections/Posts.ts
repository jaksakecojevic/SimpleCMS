import widgets from '../components/widgets';
let schema = {
	name: 'posts1',
	fields: [
		widgets.Text({
			label: 'test',
			db_fieldName: 'dbtest',
			required: true,
			icon: 'ri:t-box-line',
			placeholder: 'Enter Test Placeholder',
			localization: true,
			display: async (data, field, entry) => {
				return data;
			}
		}),
		widgets.ImageUpload({
			label: 'image',
			path: 'media/images'
		})
	]
};
export default schema;
