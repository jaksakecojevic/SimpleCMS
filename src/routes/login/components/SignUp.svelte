<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { credentials } from '@src/stores/load';
	import SignupIcon from './icons/SignupIcon.svelte';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import CMSLogo from './icons/Logo.svelte';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	export let active: undefined | 0 | 1 = undefined;
	export let firstUserExists = false;

	// zod validation Forgotton Password
	import z from 'zod';

	let errorStatus: Record<string, { status: boolean; msg: string }> = {
		general: { status: false, msg: '' },
		username: { status: false, msg: '' },
		email: { status: false, msg: '' },
		password: { status: false, msg: '' },
		confirm_password: { status: false, msg: '' },
		token: { status: false, msg: '' },
		terms: { status: false, msg: '' }
	};

	// const zod_obj: Record<string, z.ZodString> = {
	// 	username: z
	// 		.string({ required_error: get(LL).LOGIN_ZOD_Username_string() })
	// 		.regex(/^[a-zA-Z0-9@$!%*#]+$/, { message: get(LL).LOGIN_ZOD_Username_regex() })
	// 		.min(2, { message: get(LL).LOGIN_ZOD_Username_min() })
	// 		.max(24, { message: get(LL).LOGIN_ZOD_Username_max() })
	// 		.trim(),
	// 	email: z.string({ required_error: get(LL).LOGIN_ZOD_Email_string() }).email({ message: get(LL).LOGIN_ZOD_Email_email() }),
	// 	password: z
	// 		.string({ required_error: get(LL).LOGIN_ZOD_Password_string() })
	// 		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
	// 			message: get(LL).LOGIN_ZOD_Password_regex()
	// 		}),
	// 	confirm_password: z
	// 		.string({ required_error: get(LL).LOGIN_ZOD_Confirm_password_string() })
	// 		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
	// 			message: get(LL).LOGIN_ZOD_Confirm_password_regex()
	// 		}),
	// 	token: z.string({ required_error: get(LL).LOGIN_ZOD_Token_string() }).min(1)
	// 	// terms: z.boolean({ required_error: 'Confirm Terms' })
	// };

	let isLoading = false;
	let form: HTMLDivElement;

	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let token = ''; // token send by admin
	let terms = ''; // terms and conditions

	// Remove leading and trailing spaces
	$: {
		username = username.trim();
		email = email.trim();
		password = password.trim();
		confirmPassword = confirmPassword.trim();
		token = token.trim();
	}

	async function signup() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ email, password, authType: 'signUp' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;
		if (resp.status == 200) {
			credentials.set(resp);
			goto('/');
		}
	}
</script>

<section
	on:click
	on:pointerenter
	class="relative flex items-center hover"
	class:active={active == 1}
	class:inactive={active !== undefined && active !== 1}
	class:hover={active == undefined || active == 0}
>
	<div class="flex flex-col items-center justify-center w-full" class:hide={active != 1}>
		<div class="mb-8 flex flex-row gap-2">
			<CMSLogo className="w-14" fill="red" />
			<h1 class="text-2xl font-bold text-white lg:text-3xl">
				<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
				<div class="-mt-1">{$LL.LOGIN_SignUp()}</div>
			</h1>
		</div>
		<div class="-mt-2 mb-2 text-xs text-right text-red-500">{$LL.LOGIN_Required()}</div>

		<!-- Username field -->
		<FloatingInput type="text" bind:value={username} label={$LL.LOGIN_Username()} icon="mdi:user-circle" />

		<FloatingInput type="text" bind:value={email} label={$LL.LOGIN_EmailAddress()} icon="mdi:email" error="Error: No Email" labelClass="text-white" />

		<!-- Password field -->
		<FloatingInput
			type="password"
			bind:value={password}
			label={$LL.LOGIN_Password()}
			icon="mdi:password"
			error="Error: No Password"
			labelClass="text-white"
		/>

		<!-- Password Confirm -->
		<FloatingInput
			type="password"
			bind:value={password}
			label={$LL.LOGIN_ConfirmPassword()}
			icon="mdi:password"
			error="Error: No Password"
			labelClass="text-white"
		/>

		<!-- Registration Token -->
		{#if firstUserExists}
			<FloatingInput
				type="password"
				bind:value={password}
				label={$LL.LOGIN_Token()}
				icon="mdi:key-chain"
				error="Error: No Password"
				labelClass="text-white"
			/>
		{/if}

		<Button backgroundColor="white" btnClass="mt-10" on:click={signup}>{$LL.LOGIN_SignUp()}</Button>
	</div>
	<SignupIcon show={active == 0 || active == undefined} />
</section>

<style>
	.hide {
		transition: 0s;
		opacity: 0;
	}
	section {
		--width: 0%;
		background: #242728;
		flex-grow: 1;
		width: var(--width);
		transition: 0.4s;
	}
	.active {
		--width: 90%;
	}
	.inactive {
		--width: 10%;
	}
	.hover:hover {
		border-top-left-radius: 5% 50%;
		border-bottom-left-radius: 5% 50%;
		width: calc(var(--width) + 10%);
	}
</style>
