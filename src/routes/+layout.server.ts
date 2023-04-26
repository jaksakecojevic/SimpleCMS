import { redirect } from '@sveltejs/kit';
import { auth } from './api/db';
import { validate } from '@src/utils/utils';

// This SvelteKit load function checks if the user is authenticated
export async function load({ cookies, route }) {
	// Parse the credentials cookie
	let session = JSON.parse(cookies.get('credentials') || '{"username":null,"session":null}') as { username: string; session: string };
	// Validate the session
	let user = await validate(auth, session.session);

	if (user.status == 200) {
		// If the user is authenticated and tries to access the /login route
		if (route.id == '/login') {
			// Redirect them to the root route /
			throw redirect(302, '/');
		}
		return {
			credentials: { username: user.user }
		};
	} else {
		// If the user is not authenticated and tries to access any route other than /login
		if (route.id !== '/login') {
			// Redirect them to the /login route
			throw redirect(302, '/login');
		}
		return {
			credentials: { username: user.user }
		};
	}
}
