import mongoose from 'mongoose';
import type { RequestHandler } from './$types';
import type { Cookies } from '@sveltejs/kit';
import { auth } from '@src/routes/api/db';

// Define a POST request handler function
export const POST: RequestHandler = async ({ request, cookies }) => {
	// Extract form data from the request object
	let formData = await request.formData();
	let email = formData.get('email') as string;
	let password = formData.get('password') as string;
	let authType = formData.get('authType') as 'signIn' | 'signUp';

	// Determine which function to call based on the value of authType
	if (authType == 'signIn') {
		return await signIn(email, password, cookies);
	} else if (authType == 'signUp') {
		return await signUp(email, password, cookies);
	} else if (authType == 'signOut') {
		return await signOut(cookies);
	} else {
		return new Response('', { status: 404 });
	}
};

// Define an asynchronous function to sign out a user
async function signOut(cookies: Cookies) {
	// Get the value of the 'credentials' cookie
	let res = cookies.get('credentials');
	if (!res) return new Response(JSON.stringify({ status: 404 }));
	let sessionID = JSON.parse(res).session;
	if (!sessionID) return new Response(JSON.stringify({ status: 404 }));
	// Invalidate the session using the auth.invalidateSession function
	await auth.invalidateSession(sessionID);
	cookies.delete('credentials');

	return new Response(JSON.stringify({ status: 200 }));
}

// Define a function for signing up a new user and checks for FirstUser
async function checkIfFirstUserExists() {
	// Query the FirstUser collection to check if a document exists
	const firstUser = await mongoose.model('FirstUser').findOne({});

	// Return true if a FirstUser document exists, false otherwise
	return !!firstUser;
}

async function verifyRegistrationToken(token: string) {
	// Query the RegistrationToken collection to check if the provided token is valid
	const registrationToken = await mongoose.model('RegistrationToken').findOne({ token });

	// Return true if the provided token is valid, false otherwise
	return !!registrationToken;
}

async function signUp(email: string, password: string, cookies: Cookies) {
	// Check if a FirstUser document exists in the MongoDB database
	const isFirstUser = await checkIfFirstUserExists();

	// If a FirstUser document exists and no registration token is provided, return an error
	if (isFirstUser && !cookies.get('registrationToken')) {
		return new Response(JSON.stringify({ status: 400, message: 'Registration token is required for signup' }));
	}

	// If a FirstUser document exists and a registration token is provided, verify the token
	if (isFirstUser && cookies.get('registrationToken')) {
		const isTokenValid = await verifyRegistrationToken(cookies.get('registrationToken'));
		if (!isTokenValid) {
			return new Response(JSON.stringify({ status: 400, message: 'Invalid registration token' }));
		}
	}

	// Create a new user with the provided email and password
	let user = await auth
		.createUser({
			primaryKey: {
				providerId: 'email',
				providerUserId: email.toLowerCase(),
				password: password
			},
			attributes: {
				role: 'Admin',
				username: undefined,
				email: email.toLowerCase(),
				firstname: undefined,
				lastname: undefined,
				avatar: undefined,
				resetRequestedAt: undefined,
				resetToken: undefined,
				lastActiveAt: `${new Date()}`
			}
		})
		.catch((e) => null);
	if (!user) return new Response(JSON.stringify({ status: 404 }));

	// Send welcome email
	await fetch('/api/sendMail', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			subject: 'New user registration',
			message: 'New user registration',
			templateName: 'Welcome',
			props: {
				username: user.username,
				email
			}
		})
	});

	// Create a new session for the user
	const session = await auth.createSession(user.userId);

	// Retrieve the user's information
	return new Response(JSON.stringify({ user: user.username, session: session.sessionId, status: 200 }));
}

// Define a function for signing up a new user
async function signIn(email: string, password: string, cookies: Cookies) {
	// Authenticate the user with the provided email and password
	let key = await auth.useKey('email', email, password).catch(() => null);
	if (!key) return new Response(JSON.stringify({ status: 404 }));

	// Create a new session for the user
	const session = await auth.createSession(key.userId);

	// Retrieve the user's information
	let user = await auth.getUser(key.userId);
	cookies.set('credentials', JSON.stringify({ username: user.username, session: session.sessionId }), {
		path: '/'
	});

	// Return a response with the user's username, session ID, and status code
	return new Response(JSON.stringify({ userername: user.username, session: session.sessionId, status: 200 }));
}

//signout
// async function signout(email: string, password: string, cookies: Cookies) {
