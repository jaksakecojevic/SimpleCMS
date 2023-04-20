import type { RequestHandler } from './$types';
import { auth } from '@src/routes/api/db';

// Define a POST request handler function
export const POST: RequestHandler = async ({ request }) => {
	// Extract form data from the request object
	let formData = await request.formData();
	let email = formData.get('email') as string;
	let password = formData.get('password') as string;
	let authType = formData.get('authType') as 'signIn' | 'signUp';
	let sessionID = formData.get('sessionID') as string | null;

	// Determine which function to call based on the value of authType
	if (authType == 'signIn') {
		return await signIn(email, password);
	} else if (authType == 'signUp') {
		return await signUp(email, password);
	} else if (authType == 'validate') {
		return await validate(sessionID);
	} else {
		return new Response('', { status: 404 });
	}
};

// Define a function for signing up a new user
async function signUp(email: string, password: string) {
	// Create a new user with the provided email and password
	let user = await auth
		.createUser({
			primaryKey: {
				providerId: 'email',
				providerUserId: email,
				password: password
			},
			attributes: {
				username: 'Admin'
			}
		})
		.catch((e) => null);
	if (!user) return new Response(JSON.stringify({ status: 404 }));

	// Create a new session for the user
	const session = await auth.createSession(user.userId);

	// Retrieve the user's information
	return new Response(JSON.stringify({ user: user.username, session: session.sessionId, status: 200 }));
}

// Define a function for signing up a new user
async function signIn(email: string, password: string) {
	// Authenticate the user with the provided email and password
	let key = await auth.useKey('email', email, password).catch(() => null);
	if (!key) return new Response(JSON.stringify({ status: 404 }));

	// Create a new session for the user
	const session = await auth.createSession(key.userId);

	// Retrieve the user's information
	let user = await auth.getUser(key.userId);

	// Return a response with the user's username, session ID, and status code
	return new Response(JSON.stringify({ userername: user.username, session: session.sessionId, status: 200 }));
}

// Define a function for validating a session ID
async function validate(sessionID: string | null) {
	if (!sessionID) {
		return new Response(JSON.stringify({ status: 404 }));
	}
	const resp = await auth.validateSessionUser(sessionID).catch(() => null);
	if (!resp) return new Response(JSON.stringify({ status: 404 }));

	// Return a response with the user's username, session ID, and status code
	return new Response(JSON.stringify({ user: resp.user.username, session: resp.session?.sessionId, status: 200 }));
}
