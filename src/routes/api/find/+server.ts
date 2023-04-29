import type { RequestHandler } from './$types';
import { collections } from '@src/routes/api/db';

export const GET: RequestHandler = async ({ url }) => {
	try {
		// get collection name and id from URL search parameters
		let collection = collections[url.searchParams.get('collection') as string];
		let id = url.searchParams.get('id') as string | null;

		if (id) {
			// if id is provided, find document by id and return it in response
			let resp = JSON.stringify(await collection.findById(url.searchParams.get('id') as string));
			return new Response(resp);
		} else {
			// if no id is provided, get query object from URL search parameters
			let query = JSON.parse(url.searchParams.get('query') as string);
			// find documents matching query and return them in response
			let resp = JSON.stringify(await collection.find(query));
			return new Response(resp);
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
	}
};
