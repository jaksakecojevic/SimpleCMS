// Superforms integration with zod validation on server
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import z from 'zod';
import { get } from 'svelte/store';
import LL from '@src/i18n/i18n-svelte.js';

const SignInZodschema = z.object({
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(8)
		.refine((value) => value.match(/[A-Z]/), { message: 'Password must contain at least one uppercase letter' })
});

const SignUpZodschema = z.object({
	username: z
		.string({ required_error: get(LL).LOGIN_ZOD_Username_string() })
		.regex(/^[a-zA-Z0-9@$!%*#]+$/, { message: get(LL).LOGIN_ZOD_Username_regex() })
		.min(2, { message: get(LL).LOGIN_ZOD_Username_min() })
		.max(24, { message: get(LL).LOGIN_ZOD_Username_max() })
		.trim(),
	email: z.string({ required_error: get(LL).LOGIN_ZOD_Email_string() }).email({ message: get(LL).LOGIN_ZOD_Email_email() }),
	password: z
		.string({ required_error: get(LL).LOGIN_ZOD_Password_string() })
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
			message: get(LL).LOGIN_ZOD_Password_regex()
		}),
	confirm_password: z
		.string({ required_error: get(LL).LOGIN_ZOD_Confirm_password_string() })
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
			message: get(LL).LOGIN_ZOD_Confirm_password_regex()
		}),
	token: z.string({ required_error: get(LL).LOGIN_ZOD_Token_string() }).min(1)
	// terms: z.boolean({ required_error: 'Confirm Terms' })
});

export const load = async (event) => {
	// Server API:
	const form = await superValidate(event, SignInZodschema);

	// Always return { form } in load and form actions.
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, SignInZodschema);
		console.log('POST', form);

		// Convenient validation check:
		if (!form.valid) {
			// Again, always return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated data

		// Yep, return { form } here too
		return { form };
	}
};
