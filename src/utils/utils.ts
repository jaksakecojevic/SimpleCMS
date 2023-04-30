import axios from 'axios';
import fs from 'fs';
import { get } from 'svelte/store';
import { entryData, mode } from '@src/stores/store';
import type { Auth } from 'lucia-auth';
import schemas, { collection } from '../collections';
import { Blob } from 'buffer';
import type { Schema } from '@src/collections/types';

// Validates a session ID and returns information about the authenticated user
export async function validate(auth: Auth, sessionID: string | null) {
	if (!sessionID) {
		return { user: null, status: 404 };
	}
	const resp = await auth.validateSessionUser(sessionID).catch(() => null);
	if (!resp) return { user: null, status: 404 };
	return { user: resp.user.username, status: 200 };
}

// Configuration object for axios requests
export const config = {
	headers: {
		'Content-Type': 'multipart/form-data'
	}
};

// Converts data to FormData object
export const col2formData = async (getData: { [Key: string]: () => any }) => {
	const formData = new FormData();
	for (const [key, valueFn] of Object.entries(getData)) {
		const value = await valueFn();
		if (!value) continue;
		if (value instanceof FileList) {
			for (const file of Array.from(value)) {
				formData.append(key, file);
			}
		} else if (typeof value === 'object') {
			formData.append(key, JSON.stringify(value));
		} else {
			formData.append(key, value);
		}
	}
	return formData.entries().next().value ? formData : null;
};

// Saves files to disk and returns file information
export function saveFiles(data: FormData, collection: string) {
	let files: any = {};
	let _files: Array<any> = [];
	let schema = schemas.find((schema) => schema.name === collection);
	for (let [fieldname, fieldData] of data.entries()) {
		if (fieldData instanceof Blob) {
			_files.push({ blob: fieldData, fieldname });
		}
	}

	for (let file of _files) {
		let { blob, fieldname } = file;

		files[fieldname as keyof typeof files] = { name: blob.name, size: blob.size, type: blob.type, lastModified: blob.lastModified };
		let path = _findFieldByTitle(schema, fieldname).path;

		if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
		(blob as Blob).arrayBuffer().then((arrayBuffer) => {
			fs.writeFileSync(path + '/' + blob.name, Buffer.from(arrayBuffer));
		});
	}
	return files;
}

// Finds field title that matches the fieldname and returns that field
function _findFieldByTitle(schema: any, fieldname: string): any {
	let found = false;
	let result;
	for (let field of schema.fields) {
		if (field.db_fieldName == fieldname || field.label == fieldname) {
			found = true;
			result = field;
			break;
		} else if (field.fields && field.fields.length > 0) {
			result = _findFieldByTitle(field, fieldname);
			if (result) {
				found = true;
				break;
			}
		}
	}
	if (!found) {
		throw new Error(`Field '${fieldname}' not found in '${schema.name}' schema.`);
	}
	return result;
}

// takes an object and recursively parses any values that can be converted to JSON
export function parse(obj: any) {
	for (let key in obj) {
		try {
			if (Array.isArray(obj[key])) {
				for (let index of obj[key]) {
					obj[key][index] = JSON.parse(obj[key][index]);
				}
			} else {
				obj[key] = JSON.parse(obj[key]);
			}
		} catch (e) {}

		if (typeof obj[key] != 'string') {
			parse(obj[key]);
		}
	}
	return obj;
}

// Converts fields to schema object
export let fieldsToSchema = (fields: Array<any>) => {
	// removes widget, so it does not set up in db
	let schema: any = {};
	for (let field of fields) {
		schema = { ...schema, ...field.schema };
	}
	delete schema.widget;
	return schema;
};

// Finds documents in collection that match query
export async function find(query: object, collection: Schema): Promise<any> {
	try {
		// Check if collection is present
		if (!collection) return;

		// Encode query string
		const _query = encodeURIComponent(JSON.stringify(query));

		// Make API call
		const response = await axios.get(`/api/find?collection=${encodeURIComponent(collection.name)}&query=${_query}`);

		// Return data
		return response.data;
	} catch (error) {
		// Handle error appropriately
		console.error(error);
	}
}

// Finds document in collection with specified ID
export async function findById(id: string, collection: Schema): Promise<any> {
	try {
		// Check if ID and collection are present
		if (!id || !collection) return;

		// Make API call
		const response = await axios.get(`/api/find?collection=${encodeURIComponent(collection.name)}&id=${id}`);

		// Return data
		return response.data;
	} catch (error) {
		// Handle error appropriately
		console.error(error);
	}
}

// Extracts data from fieldsData by awaiting the result of each function call and returning an object with the extracted values.
export async function extractData(fieldsData: any) {
	try {
		const keys = Object.keys(fieldsData);
		const results = await Promise.all(keys.map((key) => fieldsData[key]()));
		const temp = {};
		keys.forEach((key, i) => (temp[key] = results[i]));
		return temp;
	} catch (error) {
		console.error(error);
		throw new Error('Error extracting data from fieldsData');
	}
}

// Returns field's database field name or label
export function getFieldName(field: any) {
	return (field?.db_fieldName || field?.label) as string;
}

// Saves FormData to database
export async function saveFormData({ data, _collection, _mode, id }: { data: any; _collection?: Schema; _mode?: 'edit' | 'create'; id?: string }) {
	// Get mode and collection from state
	let $mode = _mode || get(mode);
	let $collection = _collection || get(collection);

	// Get entry data from state
	let $entryData = get(entryData);

	// Convert data to FormData if necessary
	let formData = data instanceof FormData ? data : await col2formData(data);

	// Check if formData is present
	if (!formData) return;

	// Check if ID is present in edit mode
	if (_mode === 'edit' && !id) {
		throw new Error('ID is required for edit mode.');
	}

	// Make API call based on mode
	switch ($mode) {
		case 'create':
			return await axios.post(`/api/${$collection.name}`, formData, config).then((res) => res.data);
		case 'edit':
			formData.append('_id', id || $entryData._id);
			return await axios.patch(`/api/${$collection.name}`, formData, config).then((res) => res.data);
	}
}

// Clone FormData to database
export async function cloneData(data) {
	let $collection = get(collection);
	let formData = data instanceof FormData ? data : await col2formData(data);
	if (!formData) return;
	await axios.post(`/api/${$collection.name}`, formData, config);
}

// Publish FormData to database
export async function publishData(id) {
	let $collection = get(collection);
	await axios.patch(`/api/${$collection.name}/${id}`, { published: true });
}

// Unpublish FormData to database
export async function unpublishData(id) {
	let $collection = get(collection);
	await axios.patch(`/api/${$collection.name}/${id}`, { published: false });
}

// Schedule FormData to databas
export async function scheduleData(id, date) {
	let $collection = get(collection);
	await axios.patch(`/api/${$collection.name}/${id}`, { publishDate: date });
}

// Delete FormData
export async function deleteData(id) {
	let $collection = get(collection);
	await axios.delete(`/api/${$collection.name}/${id}`);
}

// Cancel FormData Creation
export function handleCancel() {
	mode.set('view');
}

// Replaces the locale slug in a URL.
//
// If the `full` argument is set to `true`, the full URL is returned as a string.
// e.g. https://mywebsite.com/en/blog/article-1 => https://mywebsite.com/de/blog/article-1
//
// Otherwise (default) the URL relative to the base is returned.
// e.g. https://mywebsite.com/en/blog/article-1 => /de/blog/article-1
export const replaceLocaleInUrl = (url: URL, locale: string, full = false): string => {
	const [, , ...rest] = url.pathname.split('/');
	const new_pathname = `/${[locale, ...rest].join('/')}`;
	if (!full) {
		return `${new_pathname}${url.search}`;
	}
	const newUrl = new URL(url.toString());
	newUrl.pathname = new_pathname;
	return newUrl.toString();
};
