import { writable } from 'svelte/store';
import ImageArray from './imageArray';
import Menu from './Menu';
import Posts from './Posts';
import Posts2 from './Posts2';
import Posts3 from './Posts3';
import Relation from './Relation';

let categories = [
	{
		name: 'Collections',
		icon: 'bi:collection',
		collections: [Posts, Posts2, Posts3, Relation]
	},
	{
		name: 'Menus',
		icon: 'bi:menu-button-wide',
		collections: [Menu, Menu]
	},
	{
		name: 'Images',
		icon: 'bi:images',
		collections: [ImageArray]
	}
];
export { categories };
let collections = categories.map((x) => x.collections).reduce((x, acc) => [].concat(x, acc)); // returns all collections
export default collections;
export let collection = writable(collections?.[0]); // current collection
