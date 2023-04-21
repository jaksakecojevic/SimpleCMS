import type { RequestHandler } from './$types';
import { collections } from '@src/routes/api/db';
import { parse, saveFiles } from '@src/utils/utils';

// Function to process form data
const processFormData = async (data: FormData) => {
	let formData: any = {};
	for (let key of data.keys()) {
		try {
			formData[key] = JSON.parse(data.get(key) as string);
		} catch (e) {
			formData[key] = data.get(key) as string;
		}
	}
	return formData;
};

// GET request handler
// export const GET: RequestHandler = async ({ params, url }) => {
// 	// Get page number and collection from URL
// 	let page = parseInt(url.searchParams.get('page') as string) || 1;
// 	let collection = collections[params.collection];
// 	// Get length and calculate skip value
// 	let length = parseInt(url.searchParams.get('length') as string) || Infinity;
// 	let skip = (page - 1) * length;

// 	// Return entry list and total count
// 	return new Response(
// 		JSON.stringify({
// 			entryList: await collection.find().skip(skip).limit(length),
// 			totalCount: await collection.countDocuments()
// 		})
// 	);
// };

// GET request handler
export const GET: RequestHandler = async ({ params, url }) => {
	try {
		// Get page number and collection from URL
		let page = parseInt(url.searchParams.get('page') as string) || 1;
		let collection = collections[params.collection];
		// Get length and calculate skip value
		let length = parseInt(url.searchParams.get('length') as string) || Infinity;
		let skip = (page - 1) * length;

		// Return entry list and total count
		return new Response(
			JSON.stringify({
				entryList: await collection.find().skip(skip).limit(length),
				totalCount: await collection.countDocuments()
			})
		);
	} catch (e) {
		return new Response(`Error: ${(e as Error).message}`, { status: 500 });
	}
};

// PATCH request handler
// export const PATCH: RequestHandler = async ({ params, request }) => {
// 	let collection = collections[params.collection];
// 	let data = await request.formData();
// 	let formData: any = {};
// 	for (let key of data.keys()) {
// 		try {
// 			formData[key] = JSON.parse(data.get(key) as string);
// 		} catch (e) {
// 			formData[key] = data.get(key) as string;
// 		}
// 	}
// 	let _id = data.get('_id');
// 	formData = parse(formData);
// 	let files = saveFiles(data, params.collection);
// 	// Update document in collection
// 	return new Response(JSON.stringify(await collection.updateOne({ _id }, { ...formData, ...files }, { upsert: true })));
// };

// PATCH request handler
export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		let collection = collections[params.collection];
		let data = await request.formData();
		let formData = await processFormData(data);
		let _id = data.get('_id');
		formData = parse(formData);
		let files = saveFiles(data, params.collection);

		// Update document in collection
		return new Response(JSON.stringify(await collection.updateOne({ _id }, { ...formData, ...files }, { upsert: true })));
	} catch (e) {
		return new Response(`Error: ${(e as Error).message}`, { status: 500 });
	}
};

// POST request handler
// export const POST: RequestHandler = async ({ params, request }) => {
// 	let collection = collections[params.collection];
// 	let data = await request.formData();
// 	let body: any = {};
// 	for (let key of data.keys()) {
// 		try {
// 			body[key] = JSON.parse(data.get(key) as string);
// 		} catch (e) {
// 			body[key] = data.get(key) as string;
// 		}
// 	}
// 	if (!collection) return new Response('collection not found!!');
// 	let files = saveFiles(data, params.collection);

// 	return new Response(JSON.stringify(await collection.insertMany({ ...body, ...files })));
// };

// POST request handler
export const POST: RequestHandler = async ({ params, request }) => {
	let collection = collections[params.collection];
	let data = await request.formData();
	let body: any = {};
	for (let key of data.keys()) {
		try {
			body[key] = JSON.parse(data.get(key) as string);
		} catch (e) {
			body[key] = data.get(key) as string;
		}
	}
	if (!collection) return new Response('collection not found!!');
	let files = saveFiles(data, params.collection);

	// Insert document into collection
	return new Response(JSON.stringify(await collection.insertMany({ ...body, ...files })));
};

// DELETE request handler
// export const DELETE: RequestHandler = async ({ params, request }) => {
// 	let collection = collections[params.collection];
// 	let data = await request.formData();

// 	let ids = data.get('ids') as string;
// 	ids = JSON.parse(ids);
// 	console.log(ids);
// 	console.log(typeof ids);

// 	return new Response(
// 		JSON.stringify(
// 			await collection.deleteMany({
// 				_id: {
// 					$in: ids
// 				}
// 			})
// 		)
// 	);
// };

// DELETE request handler
export const DELETE: RequestHandler = async ({ params, request }) => {
	try {
		let collection = collections[params.collection];
		let data = await request.formData();

		let ids = data.get('ids') as string;
		if (!ids) return new Response('No ids provided', { status: 400 });

		ids = JSON.parse(ids);

		// Delete documents from collection
		return new Response(
			JSON.stringify(
				await collection.deleteMany({
					_id: {
						$in: ids
					}
				})
			)
		);
	} catch (e) {
		return new Response(`Error: ${(e as Error).message}`, { status: 500 });
	}
};
